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
  const [score, setScore] = useState(0);

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
        chosenAnswer: '',
        choices: randomizeChoices,
        correctAnswer: correct_answer,
      }
    })
    setFormData(questionId)
  }, [questions] )


function updateState(event) {
  const id = event.target.name;
  const value = event.target.value;
  setFormData( prevState => (
    prevState.map( item => item.id === id ? 
      { ...item, chosenAnswer: value } : 
      item 
    ) 
  ))
}

function randomizeArray(arr) {
    arr.sort(() => Math.random() - 0.5);
    return arr;
}

function handleSubmit(event) { //handle errors (when user skipped questions)
  event.preventDefault();

  let tempScore = 0;
  formData.map( (item) => { //this method could be more efficient (every etc)
    if(item.chosenAnswer === item.correctAnswer) {
      tempScore ++;
    }
    return tempScore;
  })
  setScore(test);
  setIsChecked(true);
}

function restartGame() {
  setLoading(true)
  setIsChecked(false)
  setStart(false)
  setFormData([])
  setScore(0)
}

console.log(formData)

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
