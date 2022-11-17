import React from 'react';
import './Trivia.css';
import TriviaButtons from './TriviaButtons';
import Score from './Score';
import Button from './Button';

export default function Trivia(props) {
    const { game, onSubmit, restartGame, updateState } = props;
    
    //preventing it from rendering when the game is loading / or null
    if (game.state.isLoading === null || game.state.isLoading ) { 
        return null
    } 

    const questions = game.questions.map( trivia => {
        return (
            <div className="wrap" key={trivia.id}>
                <h3 dangerouslySetInnerHTML={{__html: trivia.question}}></h3>
                <TriviaButtons 
                    key={trivia.id}
                    updateState={updateState}
                    trivia={trivia}
                    hasValidatedForm={game.hasValidatedForm}
                />
                <hr />
            </div>
        )
    })

    return ( 
        <form className="Trivia-container" onSubmit={onSubmit}>
            <div>
                {questions}
            </div>
            { game.hasValidatedForm 
                ? <Score score={game.score} restartGame={restartGame} /> 
                : <Button 
                    text="Check Answers"
                    disabled={!game.hasAnsweredQuestions}
                    />
            }
        </form>
    )
}