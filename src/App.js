import React, {useState, useEffect} from 'react';
import { nanoid } from 'nanoid'
import './App.css';
import Loading from './components/Loading';
import StartScreen from './components/StartScreen';
import Trivia from './components/Trivia';
import blue from './images/blue.svg';
import yellow from './images/yellow.svg';

function App() {

  const [start, setStart] = useState(false) // Too many state variables? 
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

  async function fetchQuestions() {
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

  function handleSubmit(event) { //handle errors (when user skipped questions)
    event.preventDefault();

    const scoreArray = formData
      .filter( trivia => trivia.chosenAnswer === trivia.correctAnswer)

    setScore(scoreArray.length);
    setIsChecked(true);
  }

  function restartGame() {
    setLoading(true)
    setIsChecked(false)
    setStart(false)
    setFormData([])
    setScore(null)
  }

  console.log(score)

  return (
    <div className="App">
      { !start && <StartScreen handleClick={startGame} /> }
      { start && loading && <Loading /> }
      { start && !loading && 
          <form className="Trivia-container" onSubmit={handleSubmit}> { /* form div should be moved to Trivia component? */ }
            <Trivia formData={formData} updateState={updateState} isChecked={isChecked}/>
              { //this should not be in the template
                isChecked ? 
                  <div className="score-container"><h3>You scored {score}/5 correct answers</h3><button onClick={restartGame}>Play again!</button></div>  : 
                  <button>Check Answers</button>
              }
          </form>
      }
      <img src={blue} className="svg-blue" alt="blue bg" />
      <img src={yellow} className="svg-yellow" alt="yellow bg" />
    </div>
  );
}

export default App;
