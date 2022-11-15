import React, {useState} from 'react';
import { nanoid } from 'nanoid'
import './App.css';
import Loading from './components/Loading';
import StartScreen from './components/StartScreen';
import Trivia from './components/Trivia';
import blue from './images/blue.svg';
import yellow from './images/yellow.svg';

function App() {

  const [game, setGame] = useState({
    start: false,
    loading: true,
    questions: [],
    score: null,
    hasValidatedForm: false
  })

  function startGame() {
    updateGameState({start: true})
    fetchQuestions() //returns a promise
      .then(data => structureTriviaData(data))
  }

  async function fetchQuestions() { // Handle errors? No internet connection etc (status.ok)
    const response = await fetch('https://opentdb.com/api.php?amount=5')
    const data = await response.json()
    return data.results
  }

  function updateGameState(stateKeyValue) {
    setGame( prevState => ({ ...prevState, ...stateKeyValue}) )
  }

  function structureTriviaData(data) {
    const trivia = data.map( item => {
      const {question, incorrect_answers, correct_answer} = item;
      const randomizeChoices = randomizeArray([...incorrect_answers, correct_answer])
      return { 
        question,
        choices: randomizeChoices,
        correctAnswer: correct_answer,
        id: nanoid(),
        chosenAnswer: '',
      }
    })
    updateGameState({questions: trivia})
    updateGameState({loading: false})
  }

  function randomizeArray(arr) {
    arr.sort(() => Math.random() - 0.5);
    return arr;
  }

  function updateState(event) {
    const id = event.target.name;
    const chosenAnswer = event.target.value;
    
    const selectedAnswer = 
      game.questions.map( trivia => ( 
        trivia.id === id ? 
          { ...trivia, chosenAnswer } : 
          trivia 
      ))
    
    updateGameState({questions: selectedAnswer})
  }

  /**
   * handle errors (when user skipped questions) 
   * check answers button should be greyed out, until the user answered all the questions.
   * Handlesubmit should be moved to the trivia component (form) ? 
   */
  function handleSubmit(event) {
    event.preventDefault();

    const scoreArray = game.questions
      .filter( trivia => trivia.chosenAnswer === trivia.correctAnswer)

    updateGameState({score: scoreArray.length}) // Should this be moved to the score component?
    updateGameState({hasValidatedForm: true})
  }

  function restartGame() {
    setGame({
      start: false,
      loading: true,
      questions: [],
      score: null,
      hasValidatedForm: false
    })
  }

  console.log(game)
  return (
    <div className="App"> { /* Make this more readable, too much logic / variables */ }
      { !game.start && <StartScreen handleClick={startGame} /> }
      { game.start && game.loading && <Loading /> }
      { game.start && !game.loading && 
            <Trivia 
              game={game}
              updateState={updateState} 
              onSubmit={handleSubmit}
              restartGame={restartGame}
            />
      }
      <img src={blue} className="svg-blue" alt="blue bg" />
      <img src={yellow} className="svg-yellow" alt="yellow bg" />
    </div>
  );
}

export default App;
