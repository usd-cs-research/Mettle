import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './mainsection.css';

const studentPoints = [
  "Estimation is the process of determining approximate values for a physical quantity in a physical system without complete information.",
  "Estimation is often done as a first step in design, to establish the feasibility of an idea or to evaluate components.",
  "Estimation prioritizes quick, reasonable approximations over exact calculations to enable efficient decision-making.",
  "A good way to get a useful estimate is to consider the worst-case scenario and find the maximum value for a parameter.",
  "Practicing engineers often make such estimates for power required, time required, weight of an object, etc.",
  "In addition to estimating quantities, you must evaluate if the value makes sense in the given context."
];

const teacherPoints = [
  "Guideline 1",
  "Guideline 2",
  "Guideline 3",
  "Guideline 4",
  "Guideline 5",
  "Guideline 6"
];

export default function IntroScreenMainSection() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const LStype = localStorage.getItem("type");
  const isTeacher = LStype === "teacher";
  const points = isTeacher ? teacherPoints : studentPoints;
  const title = isTeacher ? "Guidelines for teachers" : "Engineering Estimation Fundamentals";
  const stepLabel = isTeacher ? "Guideline" : "Concept";
  const nextLabel = isTeacher ? "Next Guideline" : "Next Concept";

  const nextStep = () => {
    if (currentStep < points.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="stepper-container">
      <div className="stepper-header">
        <h2>{title}</h2>
        <div className="progress-bar-wrapper">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentStep + 1) / points.length) * 100}%` }}
          ></div>
        </div>
        <p className="step-counter">{stepLabel} {currentStep + 1} of {points.length}</p>
      </div>

      <div className="focused-card">
        {/* Changed from SVG i-icon to dynamic card number */}
        <div className="card-number-icon">
          {currentStep + 1}
        </div>
        <p className="card-content-text">
          {points[currentStep]}
        </p>
      </div>

      <div className="stepper-controls">
        <button 
          className="control-btn secondary" 
          onClick={prevStep} 
          disabled={currentStep === 0}
        >
          Back
        </button>

        {currentStep < points.length - 1 ? (
          <button className="control-btn primary" onClick={nextStep}>
            {nextLabel}
          </button>
        ) : (
          <button 
            className="control-btn success" 
            onClick={() => navigate(LStype === "teacher" ? "/teacherquestions" : "/session")}
          >
            Start Session
          </button>
        )}
      </div>
    </div>
  );
}
