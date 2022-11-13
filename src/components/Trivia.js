import React from 'react';
import './Trivia.css';

export default function Trivia(props) {

    const questions = props.formData.map( (item) => {
        return (
            <div className="wrap" key={item.id}>
                <h3 dangerouslySetInnerHTML={{__html: item.question}}></h3>
                <div className="trivia-buttons" 
                    onChange={props.updateState}>
                    {
                        item.choices.map( (choice) => {
                            return (
                                <label key={choice} className="btn-label" >
                                    <span dangerouslySetInnerHTML={{__html: choice}}></span>
                                        <input
                                            type="radio"
                                            value={choice}
                                            name={item.id}
                                        />
                                </label>
                            )
                        })
                    }
                </div>
                { 
                    item.correct !== null && 
                        <span style={{ color: item.correct ? "lightgreen" : "lightcoral"}}>
                            {item.correct ? "yay! +1" : "wrong answer"}
                    </span> 
                }
                <hr />
            </div>
        )
    })

    return ( 
        <div className="Trivia-container">
            {questions}
            <button>Check Answers</button>
        </div>
    )
}