import React from 'react';
import './StartScreen.css';
import Button from './Button';


export default function StartScreen(props) {
    if (props.isLoading !== null) {
        return null
    } 
    return (
        <div className="StartScreen">
            <h1>Quizzical</h1>
            <p>Explore and gain knowledge by answering a few questions!</p>
            <Button handleClick={props.handleClick} text="Start Quiz" />
        </div>
    )
}