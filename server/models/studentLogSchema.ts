import mongoose, { Schema, model } from 'mongoose';

interface IStudentLog {
  timestamp: Date;
  userId: string;
  sessionId: string;
  action: string;
  details: any;
  logId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const studentLogSchema = new Schema<IStudentLog>({
  timestamp: {
    type: Date,
    required: true,
    index: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  action: {
    type: String,
    required: true,
    index: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  logId: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
  collection: 'studentlogs' // Explicit collection name
});

// Compound indexes for efficient queries
studentLogSchema.index({ sessionId: 1, userId: 1, timestamp: 1 });
studentLogSchema.index({ userId: 1, timestamp: -1 });
studentLogSchema.index({ action: 1, timestamp: -1 });

// Index for unique log IDs
studentLogSchema.index({ logId: 1 }, { unique: true });

const StudentLogModel = model<IStudentLog>('StudentLog', studentLogSchema);
export default StudentLogModel;