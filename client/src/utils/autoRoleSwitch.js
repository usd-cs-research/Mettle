import { sessionSocket } from '../services/socket';
import { authContext } from '../services/authContext';

/**
 * Triggers automatic role switching in collaborative mode when progressing to next sub-question
 * @param {string} sessionId - The session ID
 * @param {string} fromPath - Current path/section user is leaving
 * @param {string} toPath - New path/section user is going to  
 * @param {string} collaborationMode - Current collaboration mode
 */
export const triggerAutoRoleSwitch = (sessionId, fromPath, toPath, collaborationMode) => {
	// Only trigger in collaborative mode
	if (collaborationMode !== 'collaborative') {
		return;
	}

	// Check if this is a progression to next sub-question/section
	const isSubQuestionProgression = checkSubQuestionProgression(fromPath, toPath);
	
	if (isSubQuestionProgression) {
		sessionSocket.emit('auto-role-switch', {
			sessionId: sessionId,
			fromPath: fromPath,
			toPath: toPath,
			eventDesc: 'auto-role-switch-progression'
		});
	}
};

/**
 * Determines if navigation represents progression to next sub-question/section
 * @param {string} fromPath - Current path
 * @param {string} toPath - Target path
 * @returns {boolean} - True if this is a forward progression
 */
const checkSubQuestionProgression = (fromPath, toPath) => {
	// Define the progression order for different question types
	const functionalFlow = [
		'model/main',
		'model/prompts', 
		'evaluate/check',
		'evaluate/dominant',
		'plan'
	];
	
	const qualitativeFlow = [
		'model',
		'evaluate/check', 
		'evaluate/dominant',
		'plan'
	];
	
	const quantitativeFlow = [
		'model',
		'evaluate/check',
		'evaluate/complete', 
		'plan'
	];
	
	// Extract the question type and sub-question from paths
	const fromSegments = extractQuestionSegments(fromPath);
	const toSegments = extractQuestionSegments(toPath);
	
	// Must be same question type to be considered progression
	if (!fromSegments || !toSegments || fromSegments.type !== toSegments.type) {
		return false;
	}
	
	// Get appropriate flow for the question type
	let flow;
	switch (fromSegments.type) {
		case 'functional':
			flow = functionalFlow;
			break;
		case 'qualitative':
			flow = qualitativeFlow;
			break;
		case 'quantitative':
			flow = quantitativeFlow;
			break;
		default:
			return false;
	}
	
	// Check if this is forward progression in the flow
	const fromIndex = flow.indexOf(fromSegments.subQuestion);
	const toIndex = flow.indexOf(toSegments.subQuestion);
	
	// Return true if moving forward in the sequence
	const isProgression = fromIndex >= 0 && toIndex >= 0 && toIndex > fromIndex;
	
	return isProgression;
};

/**
 * Extracts question type and sub-question from path
 * @param {string} path - URL path like '/sessionId/problem/functional/evaluate/check'
 * @returns {object|null} - {type: 'functional', subQuestion: 'evaluate/check'} or null
 */
const extractQuestionSegments = (path) => {
	if (!path) return null;
	
	// Remove sessionId and problem prefix to get clean path
	const pathSegments = path.split('/').filter(segment => segment && segment !== 'problem');
	
	// Find where the question type starts (functional, qualitative, quantitative)
	const questionTypes = ['functional', 'qualitative', 'quantitative'];
	let typeIndex = -1;
	
	for (let i = 0; i < pathSegments.length; i++) {
		if (questionTypes.includes(pathSegments[i])) {
			typeIndex = i;
			break;
		}
	}
	
	if (typeIndex === -1) return null;
	
	const type = pathSegments[typeIndex];
	const subQuestionParts = pathSegments.slice(typeIndex + 1);
	const subQuestion = subQuestionParts.join('/');
	
	return { type, subQuestion };
};

/**
 * Sets up listener for auto role switch events
 * @param {function} switchRole - Role switching function from authContext
 */
export const setupAutoRoleSwitchListener = (switchRole) => {
	const collaborationMode = localStorage.getItem('collaborationMode') || 'individual';
	
	if (collaborationMode === 'collaborative') {
		sessionSocket.on('auto-role-switch', (data) => {
			const currentRole = localStorage.getItem('role');
			const newRole = currentRole === 'Driver' ? 'Navigator' : 'Driver';
			
			switchRole(newRole);
		});
	}
};

/**
 * Cleans up auto role switch listener
 */
export const cleanupAutoRoleSwitchListener = () => {
	sessionSocket.off('auto-role-switch');
};