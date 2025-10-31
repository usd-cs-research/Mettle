import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../global/logoutButton';
import { sessionSocket } from '../../services/socket';
import { authContext } from '../../services/authContext.js';

export default function SessionMainSection() {
  const [sessionID, setSessionID] = useState('');
  const apiurl = process.env.REACT_APP_API_URL;
  const { showPopup } = useContext(authContext);

  const navigate = useNavigate();

  useEffect(() => {
    const handleConnect = () => {
      console.log('Socket Connected');
    };

    const handleConnectError = (error) => {
      console.error('Session socket connection error:', error);
    };

    const handleDisconnect = () => {
      console.log('Session socket disconnected');
    };

    const handleJoined = () => {
      showPopup('The other user has joined, You can continue', 'green');
    };

    sessionSocket.on('connect', handleConnect);
    sessionSocket.on('connect_error', handleConnectError);
    sessionSocket.on('disconnect', handleDisconnect);
    sessionSocket.on('joined', handleJoined);

    return () => {
      sessionSocket.off('connect', handleConnect);
      sessionSocket.off('connect_error', handleConnectError);
      sessionSocket.off('disconnect', handleDisconnect);
      sessionSocket.off('joined', handleJoined);
    };
  }, [showPopup]);

  const handleJoinSession = async (e) => {
    e.preventDefault();

    let sessionId = '';

    try {
      const response = await fetch(`${apiurl}/session/status?sessionName=${sessionID}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();

      if (!data.sessionDetails) {
        throw new Error('Session Does Not exist');
      }

      if (data.sessionDetails) {
        sessionId = data.sessionDetails._id;

        sessionSocket.connect();
        sessionSocket.emit('join', {
          sessionName: sessionID,
          userId: localStorage.getItem('userId'),
        });
        navigate(`/${sessionId}/roles`);
      }
    } catch (error) {
      showPopup(error.message, 'red');
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();

    const data = sessionID;

    try {
      const response = await fetch(`${apiurl}/session/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          sessionName: data,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        sessionSocket.connect();

        sessionSocket.emit('join', {
          sessionId: responseData.sessionId,
          userId: localStorage.getItem('userId'),
        });

        localStorage.setItem('sessionId', responseData.sessionId);

        navigate(`/${responseData.sessionId}/roles`);
      } else {
        const responseObject = await response.json();
        throw new Error(responseObject.message);
      }
    } catch (error) {
      showPopup(error.message, 'red');
    }
  };

  const handlePreviousButton = () => {
    navigate('/history');
  };

  return (
    <>
      <div className="info">
        <p>Let's Start!</p>
      </div>
      <div className="session--maincontent">
        <form>
          <div className="form-group">
            <input
              type="text"
              id="sessionid"
              value={sessionID}
              placeholder="Enter the group you want to create/Join"
              onChange={(e) => setSessionID(e.target.value)}
              required
            />
          </div>
          <div className="form-buttons">
            <button type="submit" onClick={handleJoinSession}>
              Join Session
            </button>
            <button type="submit" onClick={handleCreateSession}>
              Create Session
            </button>
          </div>
        </form>
        <div className="line-with-or">
          <div className="line"></div>
          <span className="or">or</span>
          <div className="line"></div>
        </div>
        <button onClick={handlePreviousButton} className="default--button" id="prev--solved--btn">
          Your Previously Solved Problems
        </button>
        <LogoutButton />
      </div>
    </>
  );
}
