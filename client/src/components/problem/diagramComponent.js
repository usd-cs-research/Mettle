import React, { useEffect, useRef, useState } from 'react';
import './diagramcomponent.css';
import { sessionSocket } from '../../services/socket';
import { useNavigate, useLocation, useParams } from 'react-router-dom'; // Added useLocation
import loggerService from '../../services/loggerService'; // Added for logging
import { triggerAutoRoleSwitch } from '../../utils/autoRoleSwitch'; // Added for auto-role switch

const createDefaultVisibilityState = () => ({
    functional: false,
    qualitative: false,
    quantitative: false,
    evaluation: false,
    calculation: false,
});

const createDefaultSolvedState = () => ({
    functional: false,
    qualitative: false,
    quantitative: false,
    evaluation: false,
    calculation: false,
});

const getSelectionStorageKey = (sessionId) => `problem-map-selection-${sessionId}`;
const getSolvedPiecesStorageKey = (sessionId) => `problem-map-solved-${sessionId}`;
const getStartReflectionStorageKey = (sessionId) => `problem-map-start-reflection-${sessionId}`;
const getFirstEntryStorageKey = (sessionId) => `problem-map-first-entry-${sessionId}`;

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

const getStoredSolvedState = (sessionId) => {
    const defaultState = createDefaultSolvedState();

    if (!sessionId) {
        return defaultState;
    }

    try {
        const storedValue = sessionStorage.getItem(getSolvedPiecesStorageKey(sessionId));
        if (!storedValue) {
            return defaultState;
        }

        const parsedValue = JSON.parse(storedValue);

        return {
            ...defaultState,
            ...Object.keys(defaultState).reduce((accumulator, key) => {
                accumulator[key] = Boolean(parsedValue?.[key]);
                return accumulator;
            }, {}),
        };
    } catch (error) {
        return defaultState;
    }
};

const SUBQUESTION_PATHS = {
    functional: (sessionId) => `/${sessionId}/problem/functional/model/main`,
    qualitative: (sessionId) => `/${sessionId}/problem/qualitative/model`,
    quantitative: (sessionId) => `/${sessionId}/problem/quantitative/model`,
    calculation: (sessionId) => `/${sessionId}/problem/calculation/calculation`,
    evaluation: (sessionId) => `/${sessionId}/problem/evaluation/evaluation`,
};

const NAVIGATION_DELAY_MS = 650;
const PIECE_LABELS = {
    functional: 'Functional Modeling',
    qualitative: 'Qualitative Modeling',
    quantitative: 'Quantitative Modeling',
    calculation: 'Calculation',
    evaluation: 'Evaluation',
};

const PIECE_LAYOUTS = {
    calculation: {
        transform: 'translate(-150px, -70px)',
        zIndex: 3,
    },
    evaluation: {
        transform: 'translate(250px, 170px)',
        zIndex: 2,
    },
    functional: {
        transform: 'translate(-350px, 60px)',
        zIndex: 2,
    },
    qualitative: {
        transform: 'translate(-230px, 56px)',
        zIndex: 1,
    },
    quantitative: {
        transform: 'translate(150px, -90px)',
        zIndex: 4,
    },
};

const DynamicDiagramComponent = (props) => {
    const role = localStorage.getItem('role');
    const collaborationMode = localStorage.getItem('collaborationMode') || 'individual'; // Added for logic check
    const { sessionId: routeSessionId } = useParams();
    const resolvedSessionId = props.sessionId || props.session || routeSessionId || localStorage.getItem('sessionId');
    const [visibleSubQuestions, setVisibleSubQuestions] = useState(() =>
        getStoredVisibilityState(resolvedSessionId),
    );
    const [solvedPieces, setSolvedPieces] = useState(() =>
        getStoredSolvedState(resolvedSessionId),
    );
    const [animatingPieceId, setAnimatingPieceId] = useState(null);
    const [startChoice, setStartChoice] = useState('functional');
    const [startReason, setStartReason] = useState('');
    const [showStartPrompt, setShowStartPrompt] = useState(false);
    const [firstChoicePrompt, setFirstChoicePrompt] = useState({
        open: false,
        pieceId: '',
        reason: '',
    });
    const navigate = useNavigate();
    const location = useLocation(); // Added location hook
    const navigationTimeoutRef = useRef(null);

    const hasAnySolvedPiece = Object.values(solvedPieces).some(Boolean);
    const hasEnteredAStartingPiece = resolvedSessionId
        ? sessionStorage.getItem(getFirstEntryStorageKey(resolvedSessionId)) === 'true'
        : false;

    const persistFirstEntry = () => {
        if (!resolvedSessionId) {
            return;
        }

        sessionStorage.setItem(getFirstEntryStorageKey(resolvedSessionId), 'true');
    };

    const triggerPieceNavigation = (id) => {
        const targetPathBuilder = SUBQUESTION_PATHS[id];
        const targetPath =
            resolvedSessionId && targetPathBuilder
                ? targetPathBuilder(resolvedSessionId)
                : '';

        if (!targetPath) {
            return;
        }

        persistSelection(id);
        markPieceSolved(id);
        persistFirstEntry();
        setShowStartPrompt(false);
        setAnimatingPieceId(id);

        sessionSocket.emit('forward', {
            eventDesc: 'problem--subquestion--solved',
            sessionId: resolvedSessionId,
            pieceId: id,
        });

        const currentPath = location.pathname;
        const isMainTileNavigation = ['functional', 'qualitative', 'quantitative', 'calculation', 'evaluation'].includes(id);

        if (navigationTimeoutRef.current) {
            clearTimeout(navigationTimeoutRef.current);
        }

        navigationTimeoutRef.current = setTimeout(() => {
            sessionSocket.emit('forward', {
                eventDesc: 'problem--navigate--subquestion',
                sessionId: resolvedSessionId,
                path: targetPath,
            });

            if (isMainTileNavigation) {
                triggerAutoRoleSwitch(resolvedSessionId, currentPath, targetPath, collaborationMode);
            }

            navigate(targetPath);
            setAnimatingPieceId(null);
            navigationTimeoutRef.current = null;
        }, NAVIGATION_DELAY_MS);
    };

    const persistSelection = (selectedPiece) => {
        if (!resolvedSessionId) {
            return;
        }

        if (!selectedPiece) {
            sessionStorage.removeItem(getSelectionStorageKey(resolvedSessionId));
            return;
        }

        sessionStorage.setItem(getSelectionStorageKey(resolvedSessionId), selectedPiece);
    };

    const persistSolvedPieces = (nextSolvedState) => {
        if (!resolvedSessionId) {
            return;
        }

        sessionStorage.setItem(
            getSolvedPiecesStorageKey(resolvedSessionId),
            JSON.stringify(nextSolvedState),
        );
    };

    const markPieceSolved = (pieceId) => {
        if (!pieceId || !Object.prototype.hasOwnProperty.call(createDefaultSolvedState(), pieceId)) {
            return;
        }

        setSolvedPieces((currentState) => {
            if (currentState[pieceId]) {
                return currentState;
            }

            const nextSolvedState = {
                ...currentState,
                [pieceId]: true,
            };

            persistSolvedPieces(nextSolvedState);
            return nextSolvedState;
        });
    };

    useEffect(() => {
        setVisibleSubQuestions(getStoredVisibilityState(resolvedSessionId));
        setSolvedPieces(getStoredSolvedState(resolvedSessionId));

        if (!resolvedSessionId) {
            setShowStartPrompt(false);
            return;
        }

        const storedReflection = sessionStorage.getItem(
            getStartReflectionStorageKey(resolvedSessionId),
        );
        if (storedReflection) {
            try {
                const parsedReflection = JSON.parse(storedReflection);
                setStartChoice(parsedReflection.choice || 'functional');
                setStartReason(parsedReflection.reason || '');
            } catch (error) {
                setStartChoice('functional');
                setStartReason('');
            }
        } else {
            setStartChoice('functional');
            setStartReason('');
        }

        const shouldShowPrompt =
            !sessionStorage.getItem(getFirstEntryStorageKey(resolvedSessionId)) &&
            !Object.values(getStoredSolvedState(resolvedSessionId)).some(Boolean);
        setShowStartPrompt(shouldShowPrompt);
    }, [resolvedSessionId]);

    useEffect(() => {
        return () => {
            if (navigationTimeoutRef.current) {
                clearTimeout(navigationTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const handleForward = (data) => {
            if (
                data.eventDesc === 'problem--navigate--subquestion' &&
                typeof data.path === 'string' &&
                data.path.trim()
            ) {
                navigate(data.path);
            }

            if (data.eventDesc === 'problem--subquestion--click') {
                setVisibleSubQuestions(data.data);
                const selectedPiece = Object.keys(data.data).find((key) => data.data[key]);
                persistSelection(selectedPiece);
            }

            if (data.eventDesc === 'problem--subquestion--solved' && data.pieceId) {
                markPieceSolved(data.pieceId);
            }
        };

        sessionSocket.on('forward', handleForward);

        return () => {
            sessionSocket.off('forward', handleForward);
        };
    }, [navigate, resolvedSessionId]);

    const clickHandler = (event) => {
        if (role === 'Navigator') return;

        const id = event.currentTarget.id;
        
        const visibilityState = {
            ...createDefaultVisibilityState(),
            [id]: !visibleSubQuestions[id],
        };

        const selectedPiece = visibilityState[id] ? id : null;
        persistSelection(selectedPiece);

        sessionSocket.emit('forward', {
            eventDesc: 'problem--subquestion--click',
            sessionId: resolvedSessionId,
            data: visibilityState,
        });

        setVisibleSubQuestions(visibilityState);
    };

    const doubleClickHandler = (event) => {
        // Match logic from first code: check if disabled or role is Navigator
        const isDisabled = event.currentTarget.classList.contains('disabled');
        if (isDisabled || role === 'Navigator' || animatingPieceId) {
            return;
        }

        const id = event.currentTarget.id;

        // 1. Manually log the double click as seen in the first code
        try {
            loggerService.log('subgoal_tile_doubleclick', { 
                subgoalId: id, 
                component: 'DynamicDiagramComponent',
                navigation: true 
            });
        } catch (error) {
            // Silently handle logging errors
        }

        if (!hasEnteredAStartingPiece && id !== 'functional') {
            setFirstChoicePrompt({
                open: true,
                pieceId: id,
                reason: '',
            });
            return;
        }

        triggerPieceNavigation(id);
    };

    const handleStartPromptSubmit = () => {
        if (!resolvedSessionId) {
            return;
        }

        sessionStorage.setItem(
            getStartReflectionStorageKey(resolvedSessionId),
            JSON.stringify({
                choice: startChoice,
                reason: startReason,
            }),
        );

        const visibilityState = {
            ...createDefaultVisibilityState(),
            [startChoice]: true,
        };
        setVisibleSubQuestions(visibilityState);
        persistSelection(startChoice);
        setShowStartPrompt(false);
    };

    const handleFirstChoiceContinue = () => {
        triggerPieceNavigation(firstChoicePrompt.pieceId);
        setFirstChoicePrompt({
            open: false,
            pieceId: '',
            reason: '',
        });
    };

    const getPieceStyle = (pieceId) => {
        if (solvedPieces[pieceId]) {
            return {
                transform: 'translate(0px, 0px)',
                zIndex: 5,
            };
        }

        return PIECE_LAYOUTS[pieceId] || undefined;
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
                <div className="problem-map-canvas__glow problem-map-canvas__glow--one"></div>
                <div className="problem-map-canvas__glow problem-map-canvas__glow--two"></div>

                {showStartPrompt && (
                    <div className="problem-map-prompt problem-map-prompt--start">
                        <div className="problem-map-prompt__eyebrow">Before You Begin</div>
                        <h3 className="problem-map-prompt__title">
                            Where would you like to start, and why?
                        </h3>
                        <p className="problem-map-prompt__copy">
                            Pick the piece that feels like the best first step, then
                            add a short reason for your choice.
                        </p>
                        <div className="problem-map-prompt__choices">
                            {Object.entries(PIECE_LABELS).map(([pieceId, label]) => (
                                <button
                                    key={pieceId}
                                    type="button"
                                    className={`problem-map-prompt__choice ${
                                        startChoice === pieceId
                                            ? 'problem-map-prompt__choice--active'
                                            : ''
                                    }`}
                                    onClick={() => setStartChoice(pieceId)}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                        <textarea
                            className="problem-map-prompt__textarea"
                            value={startReason}
                            onChange={(event) => setStartReason(event.target.value)}
                            placeholder="I want to start here because..."
                            rows={3}
                        />
                        <div className="problem-map-prompt__actions">
                            <button
                                type="button"
                                className="problem-map-prompt__button problem-map-prompt__button--enter"
                                onClick={handleStartPromptSubmit}
                                disabled={!startReason.trim()}
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                )}

                {/* Calculation Piece */}
                <div
                    id="calculation"
                    className={`diagram-piece diagram-piece--calculation ${
                        visibleSubQuestions.calculation ? 'diagram-piece--active' : ''
                    } ${solvedPieces.calculation ? 'diagram-piece--solved' : ''} ${animatingPieceId === 'calculation' ? 'diagram-piece--animating' : ''} ${role === 'Navigator' ? 'disabled' : ''}`}
                    onClick={clickHandler}
                    onDoubleClick={doubleClickHandler}
                    style={getPieceStyle('calculation')}
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
                    } ${solvedPieces.evaluation ? 'diagram-piece--solved' : ''} ${animatingPieceId === 'evaluation' ? 'diagram-piece--animating' : ''} ${role === 'Navigator' ? 'disabled' : ''}`}
                    onClick={clickHandler}
                    onDoubleClick={doubleClickHandler}
                    style={getPieceStyle('evaluation')}
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
                    } ${solvedPieces.functional ? 'diagram-piece--solved' : ''} ${animatingPieceId === 'functional' ? 'diagram-piece--animating' : ''} ${role === 'Navigator' ? 'disabled' : ''}`}
                    onClick={clickHandler}
                    onDoubleClick={doubleClickHandler}
                    style={getPieceStyle('functional')}
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
                    } ${solvedPieces.qualitative ? 'diagram-piece--solved' : ''} ${animatingPieceId === 'qualitative' ? 'diagram-piece--animating' : ''} ${role === 'Navigator' ? 'disabled' : ''}`}
                    onClick={clickHandler}
                    onDoubleClick={doubleClickHandler}
                    style={getPieceStyle('qualitative')}
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
                    } ${solvedPieces.quantitative ? 'diagram-piece--solved' : ''} ${animatingPieceId === 'quantitative' ? 'diagram-piece--animating' : ''} ${role === 'Navigator' ? 'disabled' : ''}`}
                    onClick={clickHandler}
                    onDoubleClick={doubleClickHandler}
                    style={getPieceStyle('quantitative')}
                >
                    <svg viewBox="0 0 500 500" className="diagram-piece__svg">
                        <polygon points="250,0 250,250 500,500 500,250" className="diagram-piece__shape" />
                        <text x="278" y="240" className="diagram-piece__text">Quantitative</text>
                        <text x="304" y="274" className="diagram-piece__text">Modeling</text>
                    </svg>
                </div>

                {firstChoicePrompt.open && (
                    <div className="problem-map-prompt problem-map-prompt--confirm">
                        <div className="problem-map-prompt__eyebrow">First Move</div>
                        <h3 className="problem-map-prompt__title">
                            Why are you choosing {PIECE_LABELS[firstChoicePrompt.pieceId]} first?
                        </h3>
                        <p className="problem-map-prompt__copy">
                            Functional modeling is often the natural starting point.
                            If you want to begin elsewhere, add a quick rationale and continue.
                        </p>
                        <textarea
                            className="problem-map-prompt__textarea"
                            value={firstChoicePrompt.reason}
                            onChange={(event) =>
                                setFirstChoicePrompt((currentState) => ({
                                    ...currentState,
                                    reason: event.target.value,
                                }))
                            }
                            placeholder="We are starting here because..."
                            rows={3}
                        />
                        <div className="problem-map-prompt__actions">
                            <button
                                type="button"
                                className="problem-map-prompt__button problem-map-prompt__button--ghost"
                                onClick={() =>
                                    setFirstChoicePrompt({
                                        open: false,
                                        pieceId: '',
                                        reason: '',
                                    })
                                }
                            >
                                Go back
                            </button>
                            <button
                                type="button"
                                className="problem-map-prompt__button problem-map-prompt__button--primary"
                                onClick={handleFirstChoiceContinue}
                                disabled={!firstChoicePrompt.reason.trim()}
                            >
                                Continue anyway
                            </button>
                        </div>
                    </div>
                )}
            </div>

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
