import React, { useRef, useEffect } from 'react';
import { sessionSocket } from '../../services/socket';
import { useParams } from 'react-router-dom';

const CustomVideoPlayer = ({ videoSrc }) => {
	const { sessionId } = useParams();
	const videoRef = useRef(null);

	const handlePause = () => {
		const video = videoRef.current;
		if (video && !video.paused) {
			video.pause();
			sessionSocket.emit('forward', {
				sessionId,
				eventDesc: 'problemMap-video-pause',
			});
		}
	};

	const handlePlay = () => {
		const video = videoRef.current;
		if (video && video.paused) {
			video.play();
			sessionSocket.emit('forward', {
				sessionId,
				eventDesc: 'problemMap-video-play',
			});
		}
	};

	useEffect(() => {
		const handleForward = (data) => {
			const video = videoRef.current;
			if (!video) {
				return;
			}

			if (data.eventDesc === 'problemMap-video-play' && video.paused) {
				video.play();
			}

			if (data.eventDesc === 'problemMap-video-pause' && !video.paused) {
				video.pause();
			}
		};

		sessionSocket.on('forward', handleForward);

		return () => {
			sessionSocket.off('forward', handleForward);
		};
	}, []);

	return (
		<div className="estimation-video-player">
			<div className="estimation-video-player__frame">
				<video ref={videoRef} className="estimation-video-player__video">
					<source src={videoSrc} type="video/mp4" />
				</video>
			</div>
			<div className="estimation-video-player__controls">
				<button
					type="button"
					onClick={handlePlay}
					className="estimation-video-player__button estimation-video-player__button--play"
				>
					Play Video
				</button>
				<button
					type="button"
					onClick={handlePause}
					className="estimation-video-player__button estimation-video-player__button--pause"
				>
					Pause Video
				</button>
			</div>
		</div>
	);
};

export default CustomVideoPlayer;
