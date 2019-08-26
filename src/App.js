import React from 'react';
import './App.css';
import ReactFCCTest from 'react-fcctest';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHeart} from '@fortawesome/free-solid-svg-icons';

class Buttons extends React.Component {
  
  render() {
    return(
      <div className="btn-container">
        <div className="row-1 row">
          <button className="btn-clear" id="clear" onClick={this.props.clearDisplay}>AC</button>
          <button className="btn-operator" id="multiply" value="*" onClick={this.props.handleOperator}>x</button>
          <button className="btn-operator" id="divide" value="/" onClick={this.props.handleOperator}>/</button>
        </div>
        <div className="row-2 row">
          <button className="btn-num" id="seven" value="7" onClick={this.props.handleInput}>7</button>
          <button className="btn-num" id="eight" value="8" onClick={this.props.handleInput}>8</button>
          <button className="btn-num" id="nine" value="9" onClick={this.props.handleInput}>9</button>
          <button className="btn-operator" id="subtract" value="-" onClick={this.props.handleOperator}>-</button>
        </div>
        <div className="row-3 row">
          <button className="btn-num" id="four" value="4" onClick={this.props.handleInput}>4</button>
          <button className="btn-num" id="five" value="5" onClick={this.props.handleInput}>5</button>
          <button className="btn-num" id="six" value="6" onClick={this.props.handleInput}>6</button>
          <button className="btn-operator" id="add" value="+" onClick={this.props.handleOperator}>+</button>
        </div>
        <div className="row-4 row">          
          <button className="btn-num" id="one" value="1" onClick={this.props.handleInput}>1</button>
          <button className="btn-num" id="two" value="2" onClick={this.props.handleInput}>2</button>
          <button className="btn-num" id="three" value="3" onClick={this.props.handleInput}>3</button>          
          <button className="btn-equal" id="equals" value="=" onClick={this.props.handleCalculation}>=</button>
        </div>
        <div className="row-5 row">
          <button className="btn-num" id="zero" value="0" onClick={this.props.handleInput}>0</button>
          <button className="btn-num" id="decimal" value="." onClick={this.props.handleInput}>.</button>          
        </div>       
      </div>
    );    
  }
}

class Display extends React.Component {
  render() {
    return (
      <div className="display">        
        <p id="display" className="display-input">{this.props.displayInput}</p>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      hasAnswer: 0,
      hasDecimal: 0,
      hasOperator: 0,
      hasMinus:  0,
    }
    this.handleInput = this.handleInput.bind(this);
    this.handleOperator = this.handleOperator.bind(this);
    this.clearDisplay = this.clearDisplay.bind(this);
    this.handleCalculation = this.handleCalculation.bind(this);
    this.infixToPostFix = this.infixToPostFix.bind(this);
    this.parsePostFix = this.parsePostFix.bind(this);        
    this.updateState = this.updateState.bind(this);
  }

  updateState(e) {
    if (this.state.hasAnswer) {
      this.setState({
        input: this.state.input + e.target.value,
        
      });
    }

    if (this.state.hasOperator) {
      this.setState({
        input: this.state.input + e.target.value,
        hasOperator: 0,
        
      });
    } else {
      if (this.state.input === "0" && e.target.value === "0") {
        this.setState({
          input: "0",
          
        });      
      } else if (this.state.input === "0" && e.target.value > "0") {
        this.setState({
          input: e.target.value,
          
        })
      } else if (e.target.value >= "0") {      
        this.setState({
          input: this.state.input + e.target.value,
          
        });      
      } else if (e.target.value === "." && !this.state.hasDecimal) {      
        this.setState({
          input: this.state.input + e.target.value,
          hasDecimal: 1,
          
        });      
      } 
    }
  }

  handleOperator(e) {
    if (this.state.hasAnswer) {
      this.setState({
        input: this.state.input + e.target.value,
        hasAnswer: 0   
      });
    }

    if (!this.state.hasOperator) {     
      this.setState({
        input: this.state.input + e.target.value,
        hasOperator: 1,
        hasDecimal: 0
      });}
     else if (this.state.hasOperator && e.target.value === "-") {
      this.setState({
        hasOperator: 0,
        hasMinus: 1,
        input: this.state.input + e.target.value,
        hasOperator: 1,
        hasDecimal: 0
      })        
    } else if (this.state.hasOperator && e.target.value === this.state.input[this.state.input.length - 1]) {
      this.setState({
        hasOperator: 1,
        input: this.state.input
      })
    } else if (this.state.hasOperator && e.target.value !== "-") {
      this.setState({
        hasOperator: 1,
        input: this.state.input.slice(0, this.state.input.length - 2) + e.target.value
      })
    } else {
      this.setState({
        input: this.state.input.slice(0, this.state.input.length - 1) + e.target.value,
        hasOperator: 1,
        hasDecimal: 0
      })
    }      
  }

  //Handle inpue - i.e. append it to input state
  handleInput(e) {
    if (!this.state.hasAnswer) {
     this.updateState(e);
    } else {
      if (e.target.value >= "0") {
        this.setState({
          input: e.target.value,
          
        });       
      } else if (e.target.value === ".") {
        this.setState({
          input: this.state.result + e.target.value,
          
        });
      } else {
        this.setState({
          input: this.state.result + " " + e.target.value + " ",
          
        });
      }
    } 
  }  

  //Remove empty string in the array
  clean(e) {
    for (let i = 0; i < e.length; i++) {
      if (e[i] === "") {
        e.splice(i, 1);
      }
    }
  }

  clearDisplay() {
    this.setState({
      result: '0', 
      input: '0',
      hasAnswer: 0,
      hasDecimal: 0,
    });
  }  

  //Check if the string is  numeric or not
  checkNumber(e) {
    return !isNaN(parseFloat(e)) && isFinite(e);
  }

  /*
    Convert the inputted infix to postfix using Shunting Yard algorithm. 
    The postfix will then be parsed later
  */
  infixToPostFix(e) {
    let equation = e;
    let arr = [];    
    
    //let equation = "3 + 5 * 6 - 2 / 4";
    //let equation = "3 + 5 * 2 - 4";
    console.log(equation);
    let outputQueue = ""; //FIFO
    let operatorStack = []; //LIFO
    let operators = "^*/+-";
    let associativity = {
      "^": "Right",
      "*": "Left",
      "/": "Left",
      "+": "Left",
      "-": "Left"
    }; 
    let precedence = {
      "^": 4,
      "*": 3,
      "/": 3,
      "+": 2,
      "-": 2
    };
    for (let i=0; i<equation.length; i++) {
      if (operators.indexOf(equation[i]) > -1) {
        let temp = " " + equation[i] + " ";
        arr.push(temp);
      } else {
        arr.push(equation[i]);
      }
    }
    equation = arr.join("");
    
    //To filter out any unwanted empty item in the array that could
    //affect our final result
    equation = equation.split(" ").filter(item => item !== "");
    
    console.log(equation);
    for (let i = 0; i < equation.length; i++) {
      let token = equation[i];
      //console.log(token)
      if (this.checkNumber(token)) {
        outputQueue += token + " ";
      } else if (operators.indexOf(token) !== -1) {
        let operator1 = token;
        let operator2 = operatorStack[operatorStack.length - 1];
        //console.log("O1: " + operator1 + "\t" + "02: " + operator2);
        while (operators.indexOf(operator2) !== -1 && (
          (associativity[operator1] === "Left" && (precedence[operator1] <= precedence[operator2])) ||
          (associativity[operator1] === "Right" && (precedence[operator1] < precedence[operator2]))
        )) {
          outputQueue += operator2 + " ";
          operatorStack.pop();
          operator2 = operatorStack[operatorStack.length - 1];
        }
        operatorStack.push(operator1);
      }
    }
    console.log("Equation pre-split: " + equation);
    if (operatorStack.length > 0) {
      outputQueue += operatorStack.reverse().join(" ");
    }
    console.log("Postfix: " + outputQueue);
    //console.log(operatorStack);
    return outputQueue;
  }

  parsePostFix(e) {
    let result =[];
    e = e.split(" ");
    console.log(e);
    for (let i = 0; i < e.length; i++) {
      if (this.checkNumber(e[i])) {
        result.push(e[i]);
      } else {
        let operand1 = result.pop();
        let operand2 = result.pop();
        console.log("a: " + operand1);
        console.log("b: " + operand2);

         if (operand2 === undefined && (e[i] === "+" || e[i] === "-")) {          
          console.log(e[i]);
          result.push(e[i] + parseFloat(operand1));
        } else {
          switch (e[i]) {
            case "+":
              result.push(parseFloat(operand1) + parseFloat(operand2));
              break;
            case "-":
              result.push(parseFloat(operand2) - parseFloat(operand1));
              break;
            case "*":
              result.push(parseFloat(operand1) * parseFloat(operand2));
              break;
            case "/":
              if (operand1 === "0") {
                result.push("Math ERROR");
                break;
              }
              result.push(parseFloat(operand2) / parseFloat(operand1));
              break;
            default: //Usually in case there is only a number (operand) entered            
              result.push(parseFloat(operand1));
          }
        } 
      }
    }     
    return result.pop();
  }

  handleCalculation(e) {    
    if (this.state.hasMinus) {
      this.setState({
        input: eval(this.state.input)
      });
    } else {
      let postfix = this.infixToPostFix(this.state.input);
      console.log(postfix);
      let result = this.parsePostFix(postfix);
      console.log(result);
      if (isNaN(result)) {
        this.setState({
          
          input: "Math ERROR",
          hasAnswer: 1
        })
      } else {
        this.setState({
          input: result,
          hasAnswer: 1,
        });
      } 
    }
  }

  render() {
    return (      
      <div className="main-wrapper">
        <link href="https://afeld.github.io/emoji-css/emoji.css" rel="stylesheet"></link>

        <h1>JavaScript Calculator</h1>
        
        <div className="calculator">
          <Display
            displayInput = {this.state.input}
          />
          <Buttons 
            handleInput = {this.handleInput}
            clearDisplay = {this.clearDisplay}
            handleCalculation = {this.handleCalculation}
            keyDown = {this.handleKeyDown}
            handleOperator = {this.handleOperator}
          /> 
          <ReactFCCTest />
        </div>
        <footer>
          <p>Coded and designed with <FontAwesomeIcon icon={faHeart} className="heart" /> by <a href="https://github.com/CharaeKeow" target="_blank" rel="noopener noreferrer">Charae Keow.</a></p>
          <p>The source code is available on <a href="https://github.com/CharaeKeow/react-drum-machine/tree/power-button" target="_blank" rel="noopener noreferrer">Github.</a></p>
          <p>NOTE: This calculator is not completely bug-free (due to my laziness  <i class="em em-grimacing"></i>) <br></br> so if you found one, <a href="https://twitter.com/messages/4562825420-4562825420?text=" target="_blank" rel="noopener noreferrer">do tell me.</a></p>
        </footer>
      </div>
    );
  }
}

export default App;