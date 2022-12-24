import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [score, setScore] = React.useState(0)
    const [bestScore, setBestScore] = React.useState(Infinity)
    
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
            console.log("You won!")
        }        
    }, [dice])
    
    React.useEffect(() => {
        localStorage.setItem("bestScore", bestScore)
        console.log("best score")
    }, [bestScore])
    
    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }

    function rollDice() {
        if (tenzies === true) {
            setDice(allNewDice())
            setTenzies(false)
            if (score < bestScore) {
                setBestScore(score)
            } else { /* Nothing to do here. */ }
            setScore(0)
        } else {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ?
                    die :
                    generateNewDie()
            }))
            setScore(prevScore => prevScore + 1)
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    function resetBestScore() {
        setBestScore(Infinity)
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls. </p>
            <p className="bold instructions"> Click Best Score to reset. </p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
            <div className="scores">
                <p> Score: </p>
                <div className="score">
                    <h2>{score}</h2>
                </div>
                <p> Best Score: </p>
                <div className="highscore" onClick={resetBestScore}>
                    <h2>{bestScore === Infinity ? "0" : bestScore}</h2>
                </div>
            </div>
        </main>
    )
}