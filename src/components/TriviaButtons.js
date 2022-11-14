import React from 'react';

export default function TriviaButtons (props) {
    const { trivia } = props

    const buttons = trivia.choices.map( (choice) => {
        let styles = {};

        /* 
            Improve this block of code
            Move to handleFormSubmit function in App.js??
            Switch statement?
        */
        if (props.isChecked) { 
            if (choice === trivia.correctAnswer) {
                if(trivia.chosenAnswer) {
                    styles = {
                        backgroundColor: '#94D7A2',
                        border: 'unset'
                    }
                }
            } else if (choice === trivia.chosenAnswer) {
                styles = {
                    backgroundColor: '#F8BCBC',
                    opacity: 0.5,
                    border: 'unset'
                }
            } else {
                styles = {
                    opacity: 0.4
                }
            }
        }
 
        return (
            <label key={choice} style={styles} >
                <span dangerouslySetInnerHTML={{__html: choice}} />
                <input
                    type="radio"
                    value={choice}
                    name={trivia.id}
                />
            </label>
        )
    })

    return (
        <div className="trivia-buttons" onChange={props.updateState}>
            { buttons }
        </div>
    )
}