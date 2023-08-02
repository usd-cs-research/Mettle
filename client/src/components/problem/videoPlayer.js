import React, { useRef } from 'react';
import { sessionSocket } from '../../services/socket';
import { useParams } from 'react-router-dom';

const CustomVideoPlayer = ({ videoSrc }) => {
	const { sessionId } = useParams(); // Use useParams to get the sessionId

	const videoRef = useRef(null);

	const handlePause = () => {
		const video = videoRef.current;
		if (video.paused) {
			return;
		} else {
			video.pause();
		}
		sessionSocket.emit('forward', {
			sessionId: sessionId,
			eventDesc: 'problemMap-video-pause',
		});
	};

	const handlePlay = () => {
		const video = videoRef.current;
		if (video.paused) {
			video.play();
		}
		sessionSocket.emit('forward', {
			sessionId: sessionId,
			eventDesc: 'problemMap-video-play',
		});
	};

	sessionSocket.on('forward', (data) => {
		const video = videoRef.current;
		if (data.eventDesc === 'problemMap-video-play') {
			if (video.paused) {
				video.play();
			}
		}

		if (data.eventDesc === 'problemMap-video-pause') {
			if (video.paused) {
				return;
			} else {
				video.pause();
			}
		}
	});

	return (
		<div>
			<video ref={videoRef} width="640" height="360">
				<source src={videoSrc} type="video/mp4" />
			</video>
			<br />
			<br />
			<button
				type="button"
				onClick={handlePlay}
				className="btn btn-primary"
			>
				Play
			</button>
			<button
				type="button"
				onClick={handlePause}
				className="btn btn-warning"
			>
				Pause
			</button>
		</div>
	);
};

export default CustomVideoPlayer;
