import { Request, Response, NextFunction } from 'express';
import StudentLogModel from '../models/studentLogSchema';

export const saveLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { logs, sessionId, userId } = req.body;
    
    if (!Array.isArray(logs) || logs.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No student logs provided or invalid format' 
      });
    }

    // ✅ Transform logs for MongoDB
    const mongoLogs = logs.map((log: any) => ({
      timestamp: new Date(log.timestamp),
      userId: userId,
      sessionId: sessionId,
      action: log.action,
      details: log.details,
      logId: log.id
    }));

    // ✅ Bulk insert to MongoDB (efficient for multiple logs)
    const result = await StudentLogModel.insertMany(mongoLogs, { 
      ordered: false // Continue on duplicate key errors
    });
    
    console.log(`📝 Saved ${result.length} student logs to MongoDB`);
    
    res.status(200).json({ 
      success: true, 
      message: `Successfully saved ${result.length} student log entries to MongoDB`,
      savedCount: result.length
    });
  } catch (error: any) {
    // Handle duplicate key errors gracefully
    if (error.code === 11000) {
      console.log('Some logs were duplicates, continuing...');
      return res.status(200).json({ 
        success: true, 
        message: 'Logs processed (some duplicates skipped)',
        savedCount: error.result?.insertedCount || 0
      });
    }
    
    console.error('Error saving student logs to MongoDB:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to save student logs to MongoDB', 
      error: error?.message || 'Unknown error'
    });
  }
};

export const getLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId, userId } = req.params;
    const { page = 1, limit = 100, action } = req.query;
    
    // ✅ Build MongoDB query
    const query: any = { sessionId, userId };
    if (action) {
      query.action = action;
    }
    
    // ✅ Paginated query with sorting
    const logs = await StudentLogModel
      .find(query)
      .sort({ timestamp: 1 }) // Chronological order
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .lean(); // Returns plain objects, not mongoose documents
    
    const totalCount = await StudentLogModel.countDocuments(query);
    
    res.status(200).json({ 
      success: true, 
      logs,
      pagination: {
        current: Number(page),
        total: Math.ceil(totalCount / Number(limit)),
        count: logs.length,
        totalLogs: totalCount
      }
    });
  } catch (error: any) {
    console.error('Error retrieving student logs from MongoDB:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve student logs from MongoDB', 
      error: error?.message || 'Unknown error'
    });
  }
};

export const getSessionLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId } = req.params;
    const { page = 1, limit = 500, action } = req.query;
    
    // ✅ Build MongoDB query for all users in session
    const query: any = { sessionId };
    if (action) {
      query.action = action;
    }
    
    // ✅ Get all logs for session with pagination
    const logs = await StudentLogModel
      .find(query)
      .sort({ timestamp: 1 }) // Chronological order
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .lean();
    
    // ✅ Get unique participants count
    const participants = await StudentLogModel.distinct('userId', { sessionId });
    const totalCount = await StudentLogModel.countDocuments(query);
    
    res.status(200).json({ 
      success: true, 
      logs,
      pagination: {
        current: Number(page),
        total: Math.ceil(totalCount / Number(limit)),
        count: logs.length,
        totalLogs: totalCount
      },
      participants: participants.length,
      participantIds: participants
    });
  } catch (error: any) {
    console.error('Error retrieving session logs from MongoDB:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve session logs from MongoDB', 
      error: error?.message || 'Unknown error'
    });
  }
};

export const downloadLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId, userId } = req.params;
    
    // ✅ Get all logs for this user/session from MongoDB
    const logs = await StudentLogModel
      .find({ sessionId, userId })
      .sort({ timestamp: 1 })
      .lean();
    
    if (logs.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'No student logs found for download' 
      });
    }
    
    // ✅ Format as JSON for download
    const jsonData = JSON.stringify(logs, null, 2);
    const fileName = `student_logs_${sessionId}_${userId}.json`;
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(jsonData);
  } catch (error: any) {
    console.error('Error downloading student logs from MongoDB:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to download student logs from MongoDB', 
      error: error?.message || 'Unknown error'
    });
  }
};

// ✅ Additional function to get analytics
export const getLogAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId } = req.params;
    
    // ✅ Aggregate analytics from MongoDB
    const analytics = await StudentLogModel.aggregate([
      { $match: { sessionId } },
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 },
          users: { $addToSet: '$userId' }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    const totalLogs = await StudentLogModel.countDocuments({ sessionId });
    const uniqueUsers = await StudentLogModel.distinct('userId', { sessionId });
    
    res.status(200).json({
      success: true,
      analytics: {
        totalLogs,
        uniqueUsers: uniqueUsers.length,
        actionBreakdown: analytics,
        participantIds: uniqueUsers
      }
    });
  } catch (error: any) {
    console.error('Error getting log analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get log analytics',
      error: error?.message || 'Unknown error'
    });
  }
};