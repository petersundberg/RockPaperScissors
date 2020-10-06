import React from 'react';
import { Choice } from './Choice';
import './App.css';

let playedSets, lastValue, myPreviousHandText, cpuPreviousHandText;
let isChecked, finalScore, wonSet;
let buttonPress, myScore, cpuScore;
let sets, gameOver, notDraw;

export default class App extends React.Component {
  constructor(props) {
    super();
    this.state = { value: ''}
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleGame = this.handleGame.bind(this);
    playedSets = 0;
    myPreviousHandText = ""
    cpuPreviousHandText = ""
    buttonPress = false;
    myScore = 0;
    cpuScore = 0;
    sets = 0;
    gameOver = false;
    notDraw = false;
  }

  /**
   * Hanterar värdesändringar på sidan, från radioknapparna och submitknappen.
   */
  handleChange(event) {
    this.setState({value: event.target.value});
    lastValue = event.target.value;
    isChecked = event.target.checked;
    event.target.defaultChecked = false;
  } 

  /**
   * Hanterar knapptryckningen när man väljer set.
   */
  handleSubmit(event) {
    event.preventDefault();
    if(isChecked) {
      if(buttonPress===false) {
        sets = parseInt(lastValue);
        buttonPress = true;
      }
      this.uncheckRadiobuttons();
      this.handleChange(event)
    }
  }

  /**
   * Hanterar knapptryckningen när man väljer hand.
   */
  handleGame(event) {
    event.preventDefault();
    if(isChecked) {
      if(playedSets<sets) {
        this.checkSetWinner(lastValue, Choice[this.generateCpuHand()])
        playedSets++;
      }
      if(!gameOver) {
        this.checkGameWinner();
      }
      this.uncheckRadiobuttons();
      this.handleChange(event)
    }
  }

  /**
   * Avmarkerar radioknappen som är markerad
   */
  uncheckRadiobuttons() {
    let radioBtns = document.getElementsByClassName("choiceButton");
    for(let i=0; i<radioBtns.length; i++) {
      if(radioBtns.item(i).checked) {
        radioBtns.item(i).checked = false;
      }
    }
  }

  /**
   * Genererar en hand åt datorn. Börjar bara med att slumpa fram ett tal mellan
   * 0-2. När första rundan är avklarad börjar datorn kolla om den vann eller inte. 
   * Om den vann lägger den sin förra hand och en slumpad i en array, där den
   * nya handen slumpas fram. (För att behålla lite slumpmässighet). Förlorar
   * datorn förra handen slumpar den fram båda värden istället för att använda
   * den förra handen.
   */
  generateCpuHand() {
    let cpuChoice = new Array(2);
    if(notDraw) {
      if(wonSet) {
        cpuChoice[0] = Choice[cpuPreviousHandText];
        cpuChoice[1] = Math.floor(Math.random() * Math.floor(3))
        return cpuChoice[Math.floor(Math.random() * Math.floor(2))]
    } else {
        cpuChoice[0] = Math.floor(Math.random() * Math.floor(3))
        cpuChoice[1] = Math.floor(Math.random() * Math.floor(3))
        return cpuChoice[Math.floor(Math.random() * Math.floor(2))]
      } 
    } else {
      return Math.floor(Math.random() * Math.floor(3))
  }
    
  }

  /**
   * Kollar vem som vann det senaste settet och lägger till poäng till vinnaren.
   * Blir settet oavgjort spelas rundan om.
   * @param {Spelarens senaste hand} myHand 
   * @param {Datorns senaste hand} cpuHand 
   */
  checkSetWinner(myHand, cpuHand) {
    myPreviousHandText = myHand;
    cpuPreviousHandText = cpuHand;
    switch(myHand) {
      case "Rock":
        if(cpuHand==="Rock") {
          playedSets--;
          notDraw = false;
        } else if(cpuHand==="Paper") {
          cpuScore++;
          notDraw = true;
          wonSet = true;
        } else {
          myScore++;
          notDraw = true;
          wonSet = false;
        }
        break;
      case "Paper":
        if(cpuHand==="Rock") {
          myScore++;
          notDraw = true;
          wonSet = false;
        } else if(cpuHand==="Paper") {
          playedSets--;
          notDraw = false;
        } else {
          cpuScore++;
          notDraw = true;
          wonSet = true;
        }
        break;
      default:
        if(cpuHand==="Rock") {
          cpuScore++;
          notDraw = true;
          wonSet = true;
        } else if(cpuHand==="Paper") {
          myScore++;
          notDraw = true;
          wonSet = false;
        } else {
          playedSets--;
          notDraw = false;
        }
        break;
    }
  }

  /**
   * Kontrollerar vem som vunnit spelet och skickar poängen och vinstmeddelandet
   * till en komponent.
   */
  checkGameWinner() {
    switch(sets) {
      case 1:
        if(myScore>cpuScore) {
          gameOver = true;
          finalScore = <FinalScore winLose="You win" myScore={myScore} cpuScore={cpuScore}/>
        } else if(myScore<cpuScore) {
          gameOver = true;
          finalScore = <FinalScore winLose="Cpu wins" myScore={myScore} cpuScore={cpuScore}/>
        }
        break;
      case 3:
        if(myScore+sets%2===sets) {
          gameOver = true;
          finalScore = <FinalScore winLose="You win" myScore={myScore} cpuScore={cpuScore}/>
      } else if(cpuScore+sets%2===sets) {
          gameOver = true;
          finalScore = <FinalScore winLose="Cpu wins" myScore={myScore} cpuScore={cpuScore}/>
        } 
        break;
      case 5:
        if(myScore+sets%2+1===sets) {
          gameOver = true;
          finalScore = <FinalScore winLose="You win" myScore={myScore} cpuScore={cpuScore}/>
      } else if(cpuScore+sets%2+1===sets) {
          gameOver = true;
          finalScore = <FinalScore winLose="Cpu wins" myScore={myScore} cpuScore={cpuScore}/>
        }
        break;
      default:
    }
  }

  /**
   * Renderar sidan med hjälp av en if-sats ifall man valt set eller inte och om
   * spelet är slut eller inte.
   */
  render() {
    let header;
    let scoreBoard;
    if(!buttonPress) {
      header = <SetText header="Choose a number of sets"/>
    } else {
      header = <SetText header="Choose hand" rounds={sets + " set"}/>
      scoreBoard = <UpdateScoreboard myScore={myScore} cpuScore={cpuScore} />
    }
    if(!buttonPress && !gameOver) {
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
    } else if(buttonPress && !gameOver) {
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

/**
 * Ändrar instruktionerna på sidan.
 */
function SetText(props) {
  return <div><p>{props.rounds}</p>
        <p>{props.header}</p></div>
}

/**
 * Uppdaterar poängräkningen och båda spelarnas senaste hand.
 */
function UpdateScoreboard(props) {
  return <div>
    <p>{"Your score: " + props.myScore}</p>
    <p>{"Cpu score: " + props.cpuScore}</p>
    <p>{"Your hand: " + myPreviousHandText}</p>
    <p>{"Cpu hand: " + cpuPreviousHandText}</p>
  </div>
}

/**
 * Skriver ut vinstmeddelande och båda spelarnas poäng.
 */
function FinalScore(props) {
  return <div>
    <h1>{props.winLose} <br/>
    {"Your score: " + props.myScore} <br/>
    {"Cpu score: " + props.cpuScore} </h1>
  </div>
}