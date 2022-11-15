import React from 'react';
import './Trivia.css';
import TriviaButtons from './TriviaButtons';
import Score from './Score';
import Button from './Button';

export default function Trivia(props) {

    const questions = props.formData.map( (trivia) => {
        return (
            <div className="wrap" key={trivia.id}>
                <h3 dangerouslySetInnerHTML={{__html: trivia.question}}></h3>
                <TriviaButtons 
                    key={trivia.id}
                    updateState={props.updateState}
                    trivia={trivia}
                    isChecked={props.isChecked}
                />
                <hr />
            </div>
        )
    })

    return ( 
        <form className="Trivia-container" onSubmit={props.onSubmit}>
            <div>
                {questions}
            </div>
            { 
            props.isChecked ? 
                <Score score={props.score} restartGame={props.restartGame} /> : 
                <Button text="Check Answers" />
            }
        </form>
    )
}