import React from 'react';

export default function TriviaButtons (props) {
    const { trivia } = props

    const buttons = trivia.choices.map( (choice) => {

        const wrongStyles = { backgroundColor: '#F8BCBC', opacity: 0.5, border: 'unset' };
        const correctStyles = { backgroundColor: '#94D7A2', border: 'unset' };
        const neutralStyles = { opacity: 0.4 };

        let styles = {};

        if (props.hasValidatedForm) { 
            switch(choice) {
                case trivia.correctAnswer:
                    styles = { ...correctStyles }
                break;
                case trivia.chosenAnswer:
                    styles = { ...wrongStyles }
                break;
                default:
                    styles = { ...neutralStyles }
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
        <div className="trivia-buttons" onChange={props.handleInputChange}>
            { buttons }
        </div>
    )
}