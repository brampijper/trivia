import React, {useState, useEffect} from 'react';
import { nanoid } from 'nanoid'
import './App.css';
import Loading from './components/Loading';
import StartScreen from './components/StartScreen';
import Trivia from './components/Trivia';
import blue from './images/blue.svg';
import yellow from './images/yellow.svg';

function App() {

  const [start, setStart] = useState(false)
  const [loading, setLoading] = useState(true)
  const [questions, setQuestions] = useState([]) 
  const [formData, setFormData] = useState([])

  function startGame() {
    setStart(true)
    fetchQuestions()
  }

  function fetchQuestions() {
    fetch('https://opentdb.com/api.php?amount=5')
      .then(res => res.json())
      .then(data => data.results)
      .then(results => giveUniqueId(results));
  }

  function giveUniqueId(results) {
    const questionsWithId = results.map( (result) => {
      return { ...result, id: nanoid() }
    })
    setQuestions(questionsWithId);
    setLoading(false)
  }

  useEffect( () => {
    const questionId = questions.map( (questionData) => {
      const {question, incorrect_answers, correct_answer, id} = questionData;
      const randomizeChoices = randomizeArray([...incorrect_answers, correct_answer])
      return { 
        id: id,
        question,
        value: '',
        choices: randomizeChoices,
        correctAnswer: correct_answer,
        correct: null
      }
    })
    setFormData(questionId)
  }, [questions] )


function updateState(event) {
  const id = event.target.name;
  const value = event.target.value;
  setFormData( prevState => (
    prevState.map( item => item.id === id ? 
      { ...item, value } : 
      item 
    ) 
  ))
}

function randomizeArray(arr) {
    arr.sort(() => Math.random() - 0.5);
    return arr;
}

function handleSubmit(event) {
  event.preventDefault();

  setFormData( prevState => (
    prevState.map( item => (
       item.value === item.correctAnswer ? 
        { ...item, correct: true } :
        { ...item, correct: false} 
    ))
  ))
  
}
  
return (
  <div className="App">
    { !start && <StartScreen handleClick={startGame} /> }
    { start && loading && <Loading /> }
    { start && !loading && 
        <form className="Trivia-container" onSubmit={handleSubmit}>
          <Trivia formData={formData} updateState={updateState} />
        </form>
    }
    <img src={blue} className="svg-blue" alt="blue bg" />
    <img src={yellow} className="svg-yellow" alt="yellow bg" />
  </div>
);
}

export default App;
