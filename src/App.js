import React, {useState, useEffect} from 'react';
import { nanoid } from 'nanoid'
import './App.css';
import Loading from './components/Loading';
import StartScreen from './components/StartScreen';
import Trivia from './components/Trivia';
import blue from './images/blue.svg';
import yellow from './images/yellow.svg';

function App() {

  const [questions, setQuestions] = useState([]) // I think I can remove Formdata and use questions state??
  const [formData, setFormData] = useState([])

  const [game, setGame] = useState({
    start: false,
    loading: true,
    score: null,
    hasValidatedForm: false
  })

  function startGame() {
    updateGameState({start: true})
    fetchQuestions() //returns a promise
      .then(data => MapAndGiveUniqueId(data))
  }

  async function fetchQuestions() { // Handle errors? No internet connection etc (status.ok)
    const response = await fetch('https://opentdb.com/api.php?amount=5')
    const data = await response.json()
    return data.results
  }

  function MapAndGiveUniqueId(data) {
    const triviaWithId = data.map( item => (
      { ...item, id: nanoid() }
    ))
    setQuestions(triviaWithId);
    updateGameState({loading: false})
  }

  function updateGameState(stateKeyValue) {
    setGame( prevState => ({ ...prevState, ...stateKeyValue}) )
  } 

  useEffect( () => {
    const setFormState = questions.map( (questionData) => {
      const {question, incorrect_answers, correct_answer, id} = questionData;
      const randomizeChoices = randomizeArray([...incorrect_answers, correct_answer])
      return { 
        id,
        question,
        chosenAnswer: '',
        choices: randomizeChoices,
        correctAnswer: correct_answer,
      }
    })
    setFormData(setFormState)
  }, [questions] )

  function randomizeArray(arr) {
    arr.sort(() => Math.random() - 0.5);
    return arr;
  }

  function updateState(event) {
    const id = event.target.name;
    const chosenAnswer = event.target.value;
    
    setFormData( prevState => (
      prevState.map( trivia => ( 
        trivia.id === id ? 
          { ...trivia, chosenAnswer } : 
          trivia )
      ) 
    ))
  }

  /**
   * handle errors (when user skipped questions) 
   * check answers button should be greyed out, until the user answered all the questions.
   * Handlesubmit should be moved to the trivia component (form) ? 
   */
  function handleSubmit(event) {
    event.preventDefault();

    const scoreArray = formData
      .filter( trivia => trivia.chosenAnswer === trivia.correctAnswer)

    updateGameState({score: scoreArray.length}) // Should this be moved to the score component?
    updateGameState({hasValidatedForm: true})
  }

  function restartGame() {
    setGame({
      start: false,
      loading: true,
      score: null,
      hasValidatedForm: false
    })
    setFormData([])
  }

  console.log(game)
  return (
    <div className="App"> { /* Make this more readable, too much logic / variables */ }
      { !game.start && <StartScreen handleClick={startGame} /> }
      { game.start && game.loading && <Loading /> }
      { game.start && !game.loading && 
            <Trivia 
              formData={formData} // too many props.
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
