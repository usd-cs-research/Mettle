import React, { useEffect, useRef, useState } from 'react';
import ProblemHeader from '../../components/problem/problemHeader';
import MyMenu from '../../components/problem/myMenu';
import { useNavigate, useParams } from 'react-router-dom';
import { sessionSocket } from '../../services/socket';
import './scribblePad.css';

export default function ScribblePadScreen() {
	const [textAreaContent, setTextAreaContent] = useState('');
	const [saveState, setSaveState] = useState('Saved');
	const [questionText, setQuestionText] = useState('Loading Question');
	const textAreaRef = useRef(null);
	const navigate = useNavigate();
	const { sessionId } = useParams();
	const apiurl = process.env.REACT_APP_API_URL;
	const role = localStorage.getItem('role');

	useEffect(() => {
		const prevNotes = async () => {
			try {
				const response = await fetch(
					`${apiurl}/session/status?sessionId=${sessionId}`,
					{
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${localStorage.getItem(
								'token',
							)}`,
						},
					},
				);
				if (!response.ok) {
					throw new Error('Failed to fetch data');
				}
				const responseObject = await response.json();
				console.log(responseObject.session);
				setTextAreaContent(responseObject.session.notepad);

				if (responseObject.session.questionId) {
					localStorage.setItem(
						'questionId',
						responseObject.session.questionId,
					);
					const questionResponse = await fetch(
						`${apiurl}/question/main?questionId=${responseObject.session.questionId}`,
						{
							headers: {
								Authorization: `Bearer ${localStorage.getItem(
									'token',
								)}`,
							},
						},
					);

					if (questionResponse.ok) {
						const questionObject = await questionResponse.json();
						setQuestionText(
							questionObject.question?.question ||
								'Loading Question',
						);
					}
				}
			} catch (error) {
				console.log(error);
			}
		};
		prevNotes();
	}, []);

	const handleChange = (event) => {
		const data = event.target.value;

		sessionSocket.emit('forward', {
			sessionId: sessionId,
			eventDesc: 'notepad-typing',
			value: data,
		});

		setTextAreaContent(data);
		setSaveState('Unsaved changes');
	};

	useEffect(() => {
		const handleForward = (data) => {
			if (data.eventDesc === 'notepad-typing') {
				setTextAreaContent(data.value);
			}

			if (data.eventDesc === 'notepad-redirect-back') {
				navigate(`/${sessionId}/problem`);
			}
		};

		sessionSocket.on('forward', handleForward);

		return () => {
			sessionSocket.off('forward', handleForward);
		};
	}, [navigate, sessionId]);

	useEffect(() => {
		if (!textAreaRef.current) {
			return;
		}

		textAreaRef.current.style.height = 'auto';
		textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
	}, [textAreaContent]);

	const handleBack = () => {
		navigate(`/${sessionId}/problem`);
		sessionSocket.emit('forward', {
			eventDesc: 'notepad-redirect-back',
			sessionId: sessionId,
		});
	};

	const handleSave = async () => {
		try {
			await fetch(`${apiurl}/session/notes?sessionId=${sessionId}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
				body: JSON.stringify({ notes: textAreaContent }),
			});
			setSaveState('Saved');
		} catch (error) {
			console.log(error);
			setSaveState('Save failed');
		}
	};

	return (
		<ProblemHeader>
			<div className="scribble-pad-header-row">
				<div className="scribble-pad-header-copy">
					<p className="scribble-pad-kicker">Workspace Notes</p>
				</div>
				<MyMenu
					question={questionText}
					variant="scribble-pad"
					buttonLabel="View Problem Statement"
				/>
			</div>
			<section className="scribble-pad-shell">
				<div className="scribble-pad-card">
					<div className="scribble-pad-topbar">
						<div>
							<h2 className="scribble-pad-title">Scratchpad</h2>
							<p className="scribble-pad-subtitle">
								Jot down ideas, assumptions, values, and partial
								steps while you work through the problem.
							</p>
						</div>
						<div className="scribble-pad-meta">
							<span className="scribble-pad-badge">
								{saveState}
							</span>
							<span className="scribble-pad-badge scribble-pad-badge--muted">
								{textAreaContent.trim()
									? `${textAreaContent.trim().split(/\s+/).length} words`
									: '0 words'}
							</span>
						</div>
					</div>

					<div className="scribble-pad-editor-wrap">
						<textarea
							ref={textAreaRef}
							className="scribble-pad-editor"
							rows="10"
							onChange={handleChange}
							value={textAreaContent}
							disabled={role === 'Navigator'}
							
						></textarea>
					</div>

					<div className="scribble-pad-footer">
						<div className="scribble-pad-role-note">
							Capture important notes before moving to the next task.
						</div>
						<div className="scribble-pad-actions">
							<button
								className="scribble-pad-button scribble-pad-button--secondary"
								onClick={handleBack}
							>
								Back
							</button>
							<button
								className="scribble-pad-button scribble-pad-button--primary"
								onClick={handleSave}
								disabled={role === 'Navigator'}
							>
								Save Notes
							</button>
						</div>
					</div>
				</div>
			</section>
		</ProblemHeader>
	);
}
