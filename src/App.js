import React, {useEffect, useState} from 'react';
import { nanoid } from 'nanoid'
import './App.css';
import Loading from './components/Loading';
import StartScreen from './components/StartScreen';
import Trivia from './components/Trivia';
import blue from './images/blue.svg';
import yellow from './images/yellow.svg';

function App() {

  const gameObj = {
    state: {
      isLoading: null,
      text: ""
    },
    questions: [],
    score: null,
    hasAnsweredQuestions: false,
    hasValidatedForm: false
  }

  const [game, setGame] = useState(gameObj)

  async function startGame() {
    updateGameState({state: {isLoading: true, text: 'generating questions..' } })
    await fetchTriviaData()
      .then( data => structureTriviaData(data));
  }

  async function fetchTriviaData() {
    try {
      const response = await fetch('https://opentdb.com/api.php?amount=5')
      const data = await response.json()
      return data.results
    } 
    catch(error) {
      updateGameState({
        state: {
          isLoading: true,
          text: `Something went wrong, ${error}`
        }
      })
      throw new Error(error)
    } 
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
    updateGameState({state: { isLoading: false, text: ''}})
  }

  function randomizeArray(arr) {
    arr.sort(() => Math.random() - 0.5);
    return arr;
  }

  function updateState(event) { // function name is not super clear
    const id = event.target.name;
    const chosenAnswer = event.target.value;
    
    const selectedAnswer = game.questions.map( trivia => (  //not very readable. 
        trivia.id === id ? 
          { ...trivia, chosenAnswer } : 
          trivia 
      ))
    
    updateGameState({questions: selectedAnswer})
  }

  // check if the user answered all questions before validating is possible.
  useEffect( () => {
    const hasAnsweredQuestions = game.questions.every( question => question.chosenAnswer)
    updateGameState({hasAnsweredQuestions})
  }, [game.questions])

  
  function handleSubmit(event) {
    event.preventDefault();

    updateGameState(calculateScore())
    updateGameState({hasValidatedForm: true})
  }

  function calculateScore() {
    const scoreArray = game.questions
      .filter( trivia => trivia.chosenAnswer === trivia.correctAnswer)
    const score = scoreArray.length;
    return { score }
  }

  function restartGame() {
    setGame(gameObj)
  }

  return (
    <div className="App">
      <StartScreen 
        handleClick={startGame} 
        isLoading={game.state.isLoading} 
      />
      { game.state.isLoading 
          ? <Loading text={game.state.text} /> 
          : <Trivia 
              game={game}
              updateState={updateState} //change function name 
              onSubmit={handleSubmit} //handleFormSubmit?
              restartGame={restartGame} />
      }
      <img src={blue} className="svg-blue" alt="blue bg" />
      <img src={yellow} className="svg-yellow" alt="yellow bg" />
    </div>
  );
}

export default App;
