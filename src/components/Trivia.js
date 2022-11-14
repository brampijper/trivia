import React from 'react';
import './Trivia.css';
import TriviaButtons from './TriviaButtons';

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
        <div className="Trivia-container">
            {questions}
        </div>
    )
}