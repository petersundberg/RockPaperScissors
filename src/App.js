import React from 'react';
import { Choice } from './Choice';
import './App.css';

let i, lastValue, myPreviousHandText, cpuPreviousHandText;
let isChecked, finalScore, wonSet;

export default class App extends React.Component {
  constructor(props) {
    super();
    this.state = { value: ''}
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleGame = this.handleGame.bind(this);
    i = 0;
    myPreviousHandText = ""
    cpuPreviousHandText = ""
  }
  buttonPress = false;
  myScore = 0;
  cpuScore = 0;
  sets = 0;
  gameOver = 0;
  winLose = '';

  handleChange(event) {
    this.setState({value: event.target.value});
    lastValue = event.target.value;
    isChecked = event.target.checked;
    event.target.defaultChecked = false;
  } 

  handleSubmit(event) {
    event.preventDefault();
    if(isChecked) {
      if(this.buttonPress===false) {
        this.sets = parseInt(lastValue);
        this.buttonPress = true;
      }
      this.uncheckRadiobuttons();
      this.handleChange(event)
    }
  }

  handleGame(event) {
    event.preventDefault();
    if(isChecked) {
      if(i<this.sets) {
        this.checkSetWinner(lastValue, Choice[this.generateCpuHand()])
        i++;
      }
      if(i===this.sets || this.gameOver===0) {
        this.checkGameWinner();
      }
      this.uncheckRadiobuttons();
      this.handleChange(event)
    }
  }

  uncheckRadiobuttons() {
    var radioBtns = document.getElementsByClassName("choiceButton");
    for(var i=0; i<radioBtns.length; i++) {
      if(radioBtns.item(i).checked) {
        radioBtns.item(i).checked = false;
      }
    }
  }

  generateCpuHand() {
    let cpuChoice = new Array(2);
    if(i===0) {
      return Math.floor(Math.random() * Math.floor(3))
    } else if(wonSet===1) {
        cpuChoice[0] = Choice[cpuPreviousHandText];
        cpuChoice[1] = Math.floor(Math.random() * Math.floor(3))
        return cpuChoice[Math.floor(Math.random() * Math.floor(2))]
    } else if(wonSet===2) {
        cpuChoice[0] = Math.floor(Math.random() * Math.floor(3))
        cpuChoice[1] = Math.floor(Math.random() * Math.floor(3))
        return cpuChoice[Math.floor(Math.random() * Math.floor(2))]
    } else {
        return Math.floor(Math.random() * Math.floor(3))
    }
  }

  checkSetWinner(myHand, cpuHand) {
    myPreviousHandText = myHand;
    cpuPreviousHandText = cpuHand;
    switch(myHand) {
      case "Rock":
        if(cpuHand==="Rock") {
          i--;
          wonSet = 3;
        } else if(cpuHand==="Paper") {
          this.cpuScore++;
          wonSet = 1;
        } else {
          this.myScore++;
          wonSet = 2;
        }
        break;
      case "Paper":
        if(cpuHand==="Rock") {
          this.myScore++;
          wonSet = 2;
        } else if(cpuHand==="Paper") {
          i--;
          wonSet = 3;
        } else {
          this.cpuScore++;
          wonSet = 1;
        }
        break;
      default:
        if(cpuHand==="Rock") {
          this.cpuScore++;
          wonSet = 1;
        } else if(cpuHand==="Paper") {
          this.myScore++;
          wonSet = 2;
        } else {
          i--;
          wonSet = 3;
        }
        break;
    }
  }

  checkGameWinner() {
    if(this.myScore===this.sets) {
      this.gameOver = 1;
      finalScore = <FinalScore winLose="You win" myScore={this.myScore} cpuScore={this.cpuScore}/>
    } else if(this.cpuScore===this.sets) {
        this.gameOver = 1;
        finalScore = <FinalScore winLose="Cpu wins" myScore={this.myScore} cpuScore={this.cpuScore}/>
    } else if(this.myScore+this.sets%2===this.sets && this.sets>1) {
        this.gameOver = 1;
        finalScore = <FinalScore winLose="You win" myScore={this.myScore} cpuScore={this.cpuScore}/>
    } else if(this.cpuScore+this.sets%2===this.sets && this.sets>1) {
        this.gameOver = 1;
        finalScore = <FinalScore winLose="Cpu wins" myScore={this.myScore} cpuScore={this.cpuScore}/>
    } else if(this.myScore+this.sets%2+1===this.sets && this.sets>3) {
        this.gameOver = 1;
        finalScore = <FinalScore winLose="You win" myScore={this.myScore} cpuScore={this.cpuScore}/>
    } else if(this.cpuScore+this.sets%2+1===this.sets && this.sets>3) {
        this.gameOver = 1;
        finalScore = <FinalScore winLose="Cpu wins" myScore={this.myScore} cpuScore={this.cpuScore}/>
    }
  }

  render() {
    let header;
    let scoreBoard;

    if(!this.buttonPress) {
      header = <SetText header="Välj antal set"/>
    } else {
      header = <SetText header="Välj hand" rounds={this.sets + " set"}/>
      scoreBoard = <UpdateScoreboard myScore={this.myScore} cpuScore={this.cpuScore} />
    }
    if(!this.buttonPress && this.gameOver===0) {
      return (
        <div className="App">
        {header}
        <form onSubmit={this.handleSubmit}>
          <div className="radioBtn">
            <label>
              1 set
              <input
                className="choiceButton"
                type="radio"
                value={1}
                onClick={this.handleChange}
                name="sets"/>
            </label>
            <label>
              3 set
              <input 
                className="choiceButton"
                type="radio" 
                value={3} 
                onClick={this.handleChange}
                name="sets"/>
            </label>
            <label>
              5 set
              <input 
                className="choiceButton"
                type="radio" 
                value={5}        
                onClick={this.handleChange}
                name="sets"/>
            </label>
          </div>
          <input type="submit" value="Go"/>
        </form>
      </div>
      );
    } else if(this.buttonPress && this.gameOver===0) {
      return(
        <div className="App">
        {header}
        <form onSubmit={this.handleGame}>
          <div id="radioBtn">
            <label>
              {Choice[0]}
              <input
                className="choiceButton"
                type="radio" 
                value={Choice[0]} 
                onClick={this.handleChange}
                name="hand"/>
            </label>
            <label>
              {Choice[1]}
              <input
                className="choiceButton"
                type="radio"
                value={Choice[1]}
                onClick={this.handleChange}
                name="hand"/>
            </label>
            <label>
              {Choice[2]}
              <input 
                className="choiceButton"
                type="radio"
                value={Choice[2]}
                onClick={this.handleChange}
                name="hand"/>
            </label>
          </div>
          <input type="submit" value="Go"/>
        </form>
        {scoreBoard}
      </div>
      );
    } else {
        return (
          <div className="App">
            {finalScore}
            <form>
              <input type="submit" value="Restart"/>
          </form>
        </div>
        );
      }
  }
}

function SetText(props) {
  return <div><p>{props.rounds}</p>
        <p>{props.header}</p></div>
}

function UpdateScoreboard(props) {
  return <div>
    <p>{"Your score: " + props.myScore}</p>
    <p>{"Cpu score: " + props.cpuScore}</p>
    <p>{"Your hand: " + myPreviousHandText}</p>
    <p>{"Cpu hand: " + cpuPreviousHandText}</p>
  </div>
}

function FinalScore(props) {
  return <div>
    <h1>{props.winLose} <br/>
    {"Your score: " + props.myScore} <br/>
    {"Cpu score: " + props.cpuScore} </h1>
  </div>
}