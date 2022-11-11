import React from 'react';
import './StartScreen.css';


export default function StartScreen(props) {
    return (
        <div className="StartScreen">
            <h1>Quizzical</h1>
            <p>Explore and gain knowledge by answering a few questions!</p>
            <button onClick={props.handleClick}>
                Start Quiz
            </button>
        </div>
    )
}