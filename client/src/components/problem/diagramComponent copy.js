import React, { useEffect, useState } from 'react';
import './diagramcomponent.css';
import { sessionSocket } from '../../services/socket';
import { useNavigate } from 'react-router-dom';

const createDefaultVisibilityState = () => ({
    functional: false,
    qualitative: false,
    quantitative: false,
    evaluation: false,
    calculation: false,
});

const getSelectionStorageKey = (sessionId) => `problem-map-selection-${sessionId}`;

const getStoredVisibilityState = (sessionId) => {
    const storedPiece = sessionStorage.getItem(getSelectionStorageKey(sessionId));
    const defaultState = createDefaultVisibilityState();

    if (!storedPiece || !Object.prototype.hasOwnProperty.call(defaultState, storedPiece)) {
        return defaultState;
    }

    return {
        ...defaultState,
        [storedPiece]: true,
    };
};

const DynamicDiagramComponent = (props) => {
    const role = localStorage.getItem('role');
    const [visibleSubQuestions, setVisibleSubQuestions] = useState(() =>
        getStoredVisibilityState(props.sessionId),
    );
    const navigate = useNavigate();

    const persistSelection = (selectedPiece) => {
        if (!selectedPiece) {
            sessionStorage.removeItem(getSelectionStorageKey(props.sessionId));
            return;
        }

        sessionStorage.setItem(getSelectionStorageKey(props.sessionId), selectedPiece);
    };

    useEffect(() => {
        setVisibleSubQuestions(getStoredVisibilityState(props.sessionId));
    }, [props.sessionId]);

    useEffect(() => {
        const handleForward = (data) => {
            if (data.eventDesc === 'problem--navigate--subquestion') {
                navigate(data.path);
            }

            if (data.eventDesc === 'problem--subquestion--click') {
                setVisibleSubQuestions(data.data);
                const selectedPiece = Object.keys(data.data).find((key) => data.data[key]);
                persistSelection(selectedPiece);
            }
        };

        sessionSocket.on('forward', handleForward);

        return () => {
            sessionSocket.off('forward', handleForward);
        };
    }, [navigate]);

    const clickHandler = (event) => {
        // Prevent interaction if the user is a Navigator
        if (role === 'Navigator') return;

        const id = event.currentTarget.id;
        
        // Logic from first component: Toggle clicked one, hide others
        const visibilityState = {
            ...createDefaultVisibilityState(),
            [id]: !visibleSubQuestions[id],
        };

        const selectedPiece = visibilityState[id] ? id : null;
        persistSelection(selectedPiece);

        sessionSocket.emit('forward', {
            eventDesc: 'problem--subquestion--click',
            sessionId: props.sessionId,
            data: visibilityState,
        });

        setVisibleSubQuestions(visibilityState);
    };

    const doubleClickHandler = (event) => {
        if (role === 'Navigator') return;

        const id = event.currentTarget.id;
        let path = '';

        // Navigation mapping logic
        if (id === 'functional') path = `/${props.sessionId}/problem/functional/model/main`;
        if (id === 'qualitative') path = `/${props.sessionId}/problem/qualitative/model`;
        if (id === 'quantitative') path = `/${props.sessionId}/problem/quantitative/model`;
        if (id === 'calculation') path = `/${props.sessionId}/problem/calculation/calculation`;
        if (id === 'evaluation') path = `/${props.sessionId}/problem/evaluation/evaluation`;

        if (path) {
            persistSelection(id);
            sessionSocket.emit('forward', {
                eventDesc: 'problem--navigate--subquestion',
                sessionId: props.sessionId,
                path,
            });
            navigate(path);
        }
    };

    return (
        <section className="problem-map-board">
            <div className="problem-map-board__header">
                <div>
                    <p className="problem-map-board__eyebrow">Interactive Map</p>
                    <h2 className="problem-map-board__title">
                        Open the puzzle one piece at a time
                    </h2>
                </div>
                <div className="problem-map-board__hint">
                    Single click to preview. Double click to enter.
                </div>
            </div>

            <div className="problem-map-canvas">
                {/* Background decorative glows */}
                <div className="problem-map-canvas__glow problem-map-canvas__glow--one"></div>
                <div className="problem-map-canvas__glow problem-map-canvas__glow--two"></div>

                {/* Calculation Piece */}
                <div
                    id="calculation"
                    className={`diagram-piece diagram-piece--calculation ${
                        visibleSubQuestions.calculation ? 'diagram-piece--active' : ''
                    } ${role === 'Navigator' ? 'disabled' : ''}`}
                    onClick={clickHandler}
                    onDoubleClick={doubleClickHandler}
                    style={{transform: 'translate(-150px, -70px)'}}
                >
                    <svg viewBox="0 0 500 500" className="diagram-piece__svg">
                        <polygon points="0,0 250,250 250,0" className="diagram-piece__shape" />
                        <text x="116" y="102" className="diagram-piece__text diagram-piece__text--small">Calculation</text>
                    </svg>
                </div>

                {/* Evaluation Piece */}
                <div
                    id="evaluation"
                    className={`diagram-piece diagram-piece--evaluation ${
                        visibleSubQuestions.evaluation ? 'diagram-piece--active' : ''
                    } ${role === 'Navigator' ? 'disabled' : ''}`}
                    onClick={clickHandler}
                    onDoubleClick={doubleClickHandler}
                    style={{transform: 'translate(250px, 170px)'}}
                >
                    <svg viewBox="0 0 500 500" className="diagram-piece__svg">
                        <polygon points="250,0 500,250 500,0" className="diagram-piece__shape" />
                        <text x="370" y="102" className="diagram-piece__text diagram-piece__text--small">Evaluation</text>
                    </svg>
                </div>

                {/* Functional Modeling Piece */}
                <div
                    id="functional"
                    className={`diagram-piece diagram-piece--functional ${
                        visibleSubQuestions.functional ? 'diagram-piece--active' : ''
                    } ${role === 'Navigator' ? 'disabled' : ''}`}
                    onClick={clickHandler}
                    onDoubleClick={doubleClickHandler}
                    style={{transform: 'translate(-350px, 60px)'}}
                >
                    <svg viewBox="0 0 500 500" className="diagram-piece__svg">
                        <polygon points="0,250 0,500 250,500" className="diagram-piece__shape" />
                        <text x="25" y="430" className="diagram-piece__text">Functional</text>
                        <text x="25" y="465" className="diagram-piece__text">Modeling</text>
                    </svg>
                </div>

                {/* Qualitative Modeling Piece */}
                <div
                    id="qualitative"
                    className={`diagram-piece diagram-piece--qualitative ${
                        visibleSubQuestions.qualitative ? 'diagram-piece--active' : ''
                    } ${role === 'Navigator' ? 'disabled' : ''}`}
                    onClick={clickHandler}
                    onDoubleClick={doubleClickHandler}
                    
                >
                    <svg viewBox="0 0 500 500" className="diagram-piece__svg">
                        <polygon points="0,0 0,250 250,500 500,500" className="diagram-piece__shape" />
                        <text x="112" y="292" className="diagram-piece__text">Qualitative</text>
                        <text x="144" y="326" className="diagram-piece__text">Modeling</text>
                    </svg>
                </div>

                {/* Quantitative Modeling Piece */}
                <div
                    id="quantitative"
                    className={`diagram-piece diagram-piece--quantitative ${
                        visibleSubQuestions.quantitative ? 'diagram-piece--active' : ''
                    } ${role === 'Navigator' ? 'disabled' : ''}`}
                    onClick={clickHandler}
                    onDoubleClick={doubleClickHandler}
                    style={{transform: 'translate(150px, -90px)'}}
                >
                    <svg viewBox="0 0 500 500" className="diagram-piece__svg">
                        <polygon points="250,0 250,250 500,500 500,250" className="diagram-piece__shape" />
                        <text x="278" y="240" className="diagram-piece__text">Quantitative</text>
                        <text x="304" y="274" className="diagram-piece__text">Modeling</text>
                    </svg>
                </div>
            </div>

            {/* Preview Section */}
            <div className={`problem-map-preview ${Object.values(visibleSubQuestions).some(Boolean) ? 'problem-map-preview--show' : ''}`}>
                <div className="problem-map-preview__label">
                    {visibleSubQuestions.functional && 'Functional Modeling'}
                    {visibleSubQuestions.qualitative && 'Qualitative Modeling'}
                    {visibleSubQuestions.quantitative && 'Quantitative Modeling'}
                    {visibleSubQuestions.calculation && 'Calculation'}
                    {visibleSubQuestions.evaluation && 'Evaluation'}
                    {!Object.values(visibleSubQuestions).some(Boolean) && 'Sub-goal preview'}
                </div>
                <div className="problem-map-preview__content">
                    {visibleSubQuestions.functional && props.functional}
                    {visibleSubQuestions.qualitative && props.qualitative}
                    {visibleSubQuestions.quantitative && props.quantitative}
                    {visibleSubQuestions.calculation && props.calculation}
                    {visibleSubQuestions.evaluation && props.evaluation}
                    {!Object.values(visibleSubQuestions).some(Boolean) && 'Select a puzzle piece to preview that sub-goal here.'}
                </div>
            </div>
        </section>
    );
};

export default DynamicDiagramComponent;
