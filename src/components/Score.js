import React from 'react';
import './Score.css';
import Button from './Button';

export default function Score(props) {
    return (
    <div className="score-container">
        <h3>
            You scored {props.score}/5 correct answers
        </h3>
        <Button 
            handleClick={props.restartGame} 
            text="Play again!" 
        />
      </div>
    )
}