import express from 'express';
import { saveLogs, getLogs, getSessionLogs, downloadLogs, getLogAnalytics } from '../controllers/logController';

const router = express.Router();

// Save student logs (no auth required for performance)
router.post('/', saveLogs);

// Get logs for specific student in session (requires auth)
router.get('/:sessionId/:userId', getLogs);

// Get all logs for a session (all students)
router.get('/session/:sessionId', getSessionLogs);

// Get analytics for a session
router.get('/analytics/:sessionId', getLogAnalytics);

// Download log file for specific student
router.get('/download/:sessionId/:userId', downloadLogs);

export default router;