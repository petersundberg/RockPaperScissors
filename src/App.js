import React from 'react';
import { Choice } from './Choice';
import './App.css';

let playedSets, myPreviousHandText, cpuPreviousHandText;
let finalScore, cpuWonSet;
let buttonNotPressed, myScore, cpuScore;
let sets, gameOver, notDraw;

export default class App extends React.Component {
  constructor(props) {
    super();
    this.state = { value: '' }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleGame = this.handleGame.bind(this);
    playedSets = 0;
    myPreviousHandText = ""
    cpuPreviousHandText = ""
    buttonNotPressed = true;
    myScore = 0;
    cpuScore = 0;
    gameOver = false;
    notDraw = false;
  }

  /**
   * Hanterar värdesändringar på sidan, från radioknapparna och submitknappen.
   */
  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  /**
   * Hanterar knapptryckningen när man väljer set.
   */
  handleSubmit(event) {
    sets = event.target.value;
    if (buttonNotPressed) {
      buttonNotPressed = false;
    }
    this.handleChange(event)
  }

  /**
   * Hanterar knapptryckningen när man väljer hand.
   */
  handleGame(event) {
    if (playedSets < sets) {
      this.checkSetWinner(event.target.value, Choice[this.generateCpuHand()])
      playedSets++;
    }
    if (!gameOver) {
      this.checkGameWinner();
    }
    this.handleChange(event)
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
    if (notDraw) {
      if (cpuWonSet) {
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
   * Blir settet oavgjort spelas rundan om. Default hanterar Scissors.
   * @param {Spelarens senaste hand} myHand 
   * @param {Datorns senaste hand} cpuHand 
   */
  checkSetWinner(myHand, cpuHand) {
    myPreviousHandText = myHand;
    cpuPreviousHandText = cpuHand;
    switch (myHand) {
      case "Rock":
        if (cpuHand === "Rock") {
          playedSets--;
          notDraw = false;
        } else if (cpuHand === "Paper") {
          cpuScore++;
          notDraw = true;
          cpuWonSet = true;
        } else {
          myScore++;
          notDraw = true;
          cpuWonSet = false;
        }
        break;
      case "Paper":
        if (cpuHand === "Rock") {
          myScore++;
          notDraw = true;
          cpuWonSet = false;
        } else if (cpuHand === "Paper") {
          playedSets--;
          notDraw = false;
        } else {
          cpuScore++;
          notDraw = true;
          cpuWonSet = true;
        }
        break;
      default:
        if (cpuHand === "Rock") {
          cpuScore++;
          notDraw = true;
          cpuWonSet = true;
        } else if (cpuHand === "Paper") {
          myScore++;
          notDraw = true;
          cpuWonSet = false;
        } else {
          playedSets--;
          notDraw = false;
        }
        break;
    }
  }

  /**
   * Kontrollerar vem som vunnit spelet och skickar poängen och vinstmeddelandet
   * till en komponent. Default hanterar 5 set.
   */
  checkGameWinner() {
    switch (sets) {
      case "1":
        if (myScore > cpuScore) {
          gameOver = true;
          finalScore = <FinalScore winLose="You win" myScore={myScore} cpuScore={cpuScore} />
        } else if (myScore < cpuScore) {
          gameOver = true;
          finalScore = <FinalScore winLose="Cpu wins" myScore={myScore} cpuScore={cpuScore} />
        }
        break;
      case "3":
        if (myScore + sets % 2 === +sets) {
          gameOver = true;
          finalScore = <FinalScore winLose="You win" myScore={myScore} cpuScore={cpuScore} />
        } else if (cpuScore + sets % 2 === +sets) {
          gameOver = true;
          finalScore = <FinalScore winLose="Cpu wins" myScore={myScore} cpuScore={cpuScore} />
        }
        break;
      default:
        if (myScore + sets % 2 + 1 === +sets) {
          gameOver = true;
          finalScore = <FinalScore winLose="You win" myScore={myScore} cpuScore={cpuScore} />
        } else if (cpuScore + sets % 2 + 1 === +sets) {
          gameOver = true;
          finalScore = <FinalScore winLose="Cpu wins" myScore={myScore} cpuScore={cpuScore} />
        }
        break;
    }
  }

  /**
   * Renderar sidan med hjälp av en if-sats ifall man valt set eller inte och om
   * spelet är slut eller inte.
   */
  render() {
    if (buttonNotPressed) {
      return (
        <div className="App">
          <h1>Rock, Paper, Scissors</h1>
          <SetText header="Choose a number of sets" />
          <SetForm click={this.handleSubmit} value1={1} value2={3} value3={5} />
        </div>
      );
    } else if (!gameOver) {
      return (
        <div className="App">
          <h1>Rock, Paper, Scissors</h1>
          <SetText header="Choose hand" rounds={sets + " set"} />
          <SetForm click={this.handleGame} value1={Choice[0]} value2={Choice[1]} value3={Choice[2]} />
          <UpdateScoreboard myScore={myScore} cpuScore={cpuScore} />
        </div>
      );
    } else {
      return (
        <div className="App">
          <h1>Rock, Paper, Scissors</h1>
          {finalScore}
          <form>
            <input type="submit" value="Restart" />
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
  return (
    <div>
      <p>{props.rounds}</p>
      <p>{props.header}</p>
    </div>
  )
}

/**
 * Uppdaterar poängräkningen och båda spelarnas senaste hand.
 */
function UpdateScoreboard(props) {
  return (
    <div>
      <p>{"Your score: " + props.myScore}</p>
      <p>{"Cpu score: " + props.cpuScore}</p>
      <p>{"Your hand: " + myPreviousHandText}</p>
      <p>{"Cpu hand: " + cpuPreviousHandText}</p>
    </div>
  )
}

/**
 * Skriver ut vinstmeddelande och båda spelarnas poäng.
 */
function FinalScore(props) {
  return (
    <div>
      <h1>{props.winLose}</h1>
      <h3>{"Your score: " + props.myScore}</h3>
      <h3>{"Cpu score: " + props.cpuScore}</h3>
    </div>
  )
}

function SetForm(props) {
  return (
    <div className="choiceButton">
      <input
        className="choiceButton"
        type="button"
        value={props.value1}
        onClick={props.click}
        name="sets" />
      <input
        className="choiceButton"
        type="button"
        value={props.value2}
        onClick={props.click}
        name="sets" />
      <input
        className="choiceButton"
        type="button"
        value={props.value3}
        onClick={props.click}
        name="sets" />
    </div>
  )
}