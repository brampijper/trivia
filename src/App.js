import React, {useState, useEffect} from 'react';
import { nanoid } from 'nanoid'
import './App.css';
import Loading from './components/Loading';
import StartScreen from './components/StartScreen';
import Trivia from './components/Trivia';
import blue from './images/blue.svg';
import yellow from './images/yellow.svg';

function App() {

  const [start, setStart] = useState(false) // Too many state variables? Move some to Trivia (form)?
  const [loading, setLoading] = useState(true)
  const [questions, setQuestions] = useState([]) 
  const [formData, setFormData] = useState([])
  const [isChecked, setIsChecked] = useState(false)
  const [score, setScore] = useState(null);

  function startGame() {
    setStart(true)
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
    setLoading(false)
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

    setScore(scoreArray.length); // Should this be moved to the score component?
    setIsChecked(true);
  }

  function restartGame() {
    setLoading(true)
    setIsChecked(false)
    setStart(false)
    setFormData([])
    setScore(null)
  }

  return (
    <div className="App"> { /* Make this more readable, too much logic / variables */ }
      { !start && <StartScreen handleClick={startGame} /> }
      { start && loading && <Loading /> }
      { start && !loading && 
            <Trivia 
              formData={formData} // too many props.
              updateState={updateState} 
              isChecked={isChecked}
              onSubmit={handleSubmit}
              score={score}
              restartGame={restartGame}
            />
      }
      <img src={blue} className="svg-blue" alt="blue bg" />
      <img src={yellow} className="svg-yellow" alt="yellow bg" />
    </div>
  );
}

export default App;
