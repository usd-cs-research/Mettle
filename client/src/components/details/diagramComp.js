import React, { useState, useEffect } from 'react';
import './diagramcomponent.css';

const DiagramComponent = () => {
    const [isAssembled, setIsAssembled] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [demoFinished, setDemoFinished] = useState(false);
    
    const [visibleSubQuestions, setVisibleSubQuestions] = useState({
        functional: false, qualitative: false, quantitative: false,
        evaluation: false, calculation: false,
    });

    useEffect(() => {
        // Step 1: Start scattered (default state)
        // Step 2: Show first popup after a short delay
        setTimeout(() => {
            setPopupMessage("Once you solve all the sub questions(puzzle pieces), the problem(puzzle) will be solved!");
            setShowPopup(true);
        }, 1000);
    }, []);

    const startAssembly = () => {
        setShowPopup(false);
        // Step 3: Trigger assembly animation
        setTimeout(() => {
            setIsAssembled(true);
            // Optional: Play a "click" or "shimmer" sound here
            // const audio = new Audio('/assemble_sound.mp3'); audio.play();
        }, 500);

        // Step 4: Show final demonstration message
        setTimeout(() => {
            setPopupMessage("This was just a demonstration! Now click on any sub-goal to begin.");
            setShowPopup(true);
            setDemoFinished(true);
        }, 3000);
    };

    const clickHandler = (event) => {
        if (!demoFinished) return; // Prevent clicks during demo
        const id = event.currentTarget.id;
        setVisibleSubQuestions({
            functional: false, qualitative: false, quantitative: false,
            evaluation: false, calculation: false,
            [id]: !visibleSubQuestions[id],
        });
    };

    return (
        <div className="diagram-wrapper">
            {showPopup && (
                <div className="puzzle-popup">
                    <p>{popupMessage}</p>
                    {!demoFinished ? (
                        <button onClick={startAssembly}>Got it!</button>
                    ) : (
                        <button onClick={() => setShowPopup(false)}>Start Solving</button>
                    )}
                </div>
            )}

            
              

<div className={`svg--container diagram-component ${isAssembled ? 'assembled' : 'scattered'}`}>
    <svg
        width="400px" height="400px" // Fixed size for the central "box"
        viewBox="0 0 400 400"
        className="main-puzzle-svg"
        style={{ overflow: 'visible' }} // CRITICAL: allows pieces to move outside SVG bounds
    >
        <rect width="400" height="400" className="puzzle-bg" />

        {/* Scattered across the screen using percentages of viewport width/height */}
        <g id="functional" className="puzzle-piece" onClick={clickHandler} 
           style={{"--tx": "-25vw", "--ty": "0vh", "--r": "15deg"}}>
            <polygon points="0,200 0,400 200,400" className="tas_map" />
            <text x="10" y="380">Functional Modeling</text>
        </g>

        <g id="qualitative" className="puzzle-piece" onClick={clickHandler} 
           style={{"--tx": "30vw", "--ty": "30vh", "--r": "-20deg"}}>
            <polygon points="0,0 0,200 200,400 400,400" className="tas_map" />
            <text x="80" y="250">Qualitative Modeling</text>
        </g>

        <g id="quantitative" className="puzzle-piece" onClick={clickHandler} 
           style={{"--tx": "30vw", "--ty": "-30vh", "--r": "10deg"}}>
            <polygon points="200,0 200,200 400,400 400,200" className="tas_map" />
            <text x="220" y="200">Quantitative Modeling</text>
        </g>

        <g id="calculation" className="puzzle-piece" onClick={clickHandler} 
           style={{"--tx": "-30vw", "--ty": "10vh", "--r": "-15deg"}}>
            <polygon points="0,0 200,200 200,0" className="tas_map" />
            <text x="105" y="70">Calculation</text>
        </g>

        <g id="evaluation" className="puzzle-piece" onClick={clickHandler} 
           style={{"--tx": "10vw", "--ty": "-30vh", "--r": "25deg"}}>
            <polygon points="200,0 400,200 400,0" className="tas_map" />
            <text x="310" y="85">Evaluation</text>
        </g>
    </svg>
   


                {/* Question Sidebars */}
                {Object.keys(visibleSubQuestions).map((key) => (
                    <div key={key} className={`subq ${visibleSubQuestions[key] ? 'show' : ''}`}>
                        {key === 'functional' && "What does the heart need to do? that requires power?"}
                        {key === 'qualitative' && "What are the dominant parameters that affect power?"}
                        {key === 'quantitative' && "What is the equation connecting power required to the dominant parameters?"}
                        {key === 'calculation' && "Substituting reasonable values in the equation, what is the estimate of power?"}
                        {key === 'evaluation' && "Is the estimated value of power reasonable?"}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DiagramComponent;