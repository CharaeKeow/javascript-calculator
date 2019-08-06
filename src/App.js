import React from 'react';
import './App.css';


class Buttons extends React.Component {
  render() {
    return(
      <div className="btn-container">
        <button id="zero" value="0" onClick={this.props.handleInput}>0</button>
        <button id="one" value="1" onClick={this.props.handleInput}>1</button>
        <button id="two" value="2" onClick={this.props.handleInput}>2</button>
        <button id="three" value="3" onClick={this.props.handleInput}>3</button>
        <button id="four" value="4" onClick={this.props.handleInput}>4</button>
        <button id="five" value="5" onClick={this.props.handleInput}>5</button>
        <button id="six" value="6" onClick={this.props.handleInput}>6</button>
        <button id="seven" value="7" onClick={this.props.handleInput}>7</button>
        <button id="eight" value="8" onClick={this.props.handleInput}>8</button>
        <button id="nine" value="9" onClick={this.props.handleInput}>9</button>
        <button id="equals" value="=" onClick={this.props.handleCalculation}>=</button>
        <button id="add" value="+" onClick={this.props.handleInput}>+</button>
        <button id="subtract" value="-" onClick={this.props.handleInput}>-</button>
        <button id="multiply" value="*" onClick={this.props.handleInput}>x</button>
        <button id="divide" value="/" onClick={this.props.handleInput}>/</button>
        <button id="clear" onClick={this.props.clearDisplay}>AC</button>
        <button id="decimal" value="." onClick={this.props.handleInput}>.</button>
      </div>
    );    
  }
}

class Display extends React.Component {
  render() {
    return (
      <div id="display">        
        <p className="display-input">{this.props.displayInput}</p>
        <p className="display-result">{this.props.result}</p>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: '0',
      input: '',
      hasAnswer: 0,
      hasDecimal: 0,
      hasOperator: 0
    }
    this.handleInput = this.handleInput.bind(this);
    this.clearDisplay = this.clearDisplay.bind(this);
    this.handleCalculation = this.handleCalculation.bind(this);
    this.infixToPostFix = this.infixToPostFix.bind(this);
    this.parsePostFix = this.parsePostFix.bind(this);        
    this.updateState = this.updateState.bind(this);
  }

  /* I can't find a better name, so will stick with this for now.
     The function is self-descriptive, it will update the input state
     according to user input (i.e numbers, decimal, operator)
  */
  updateState(e) {
    if (this.state.hasAnswer) {
      this.setState({input: e.target.value});
    }

    if (this.state.hasOperator) {
      this.setState({
        input: this.state.input.replace(this.state.input[this.state.input.length - 2], e.target.value),
        hasOperator: 1        
      })
    }

    if (this.state.input === "0" && e.target.value === "0") {
      this.setState({
        input: "0",
        hasOperator: 0
      });
    } else if (this.state.input === "0" && e.target.value > "0") {
      this.setState({
        input: e.target.value
      })
    } else if (e.target.value >= "0") {
      this.setState({
        input: this.state.input + e.target.value,
        hasOperator: 0
      })
    } else if (e.target.value === ".") {
      if (!this.state.hasDecimal) {
        this.setState({
          input: this.state.input + e.target.value,
          hasDecimal: 1
        })
      } 
    } else if (!this.state.hasOperator) {      
      this.setState({
        input: this.state.input + " " + e.target.value + " ",
        hasDecimal: 0,
        hasOperator: 1
      });
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
          hasAnswer: 0
        });       
      } else if (e.target.value === ".") {
        this.setState({
          input: this.state.result + e.target.value,
          hasAnswer: 0
        });
      } else {
        this.setState({
          input: this.state.result + " " + e.target.value + " ",
          hasAnswer: 0
        });
      }
    } 
  }

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
      input: '',
      hasAnswer: 0,
      hasDecimal: 0
    });
  }  

  //Check if the string is  numeric or not
  checkNumber(e) {
    return !isNaN(parseFloat(e)) && isFinite(e);
  }

  infixToPostFix() {
    let equation = this.state.input;
    //let equation = "- 2";
    //let equation = "3 + 5 * 2 - 4";
    //console.log(equation);
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
    let postfix = this.infixToPostFix();
    console.log(postfix);
    let result = this.parsePostFix(postfix);
    console.log(result);
    if (isNaN(result)) {
      this.setState({
        result: "Math ERROR",
        hasAnswer: 1
      })
    } else {
      this.setState({
        result: result,
        hasAnswer: 1
      })
    }    
  }



  render() {
    return (
      <div className="main-wrapper">
        <h1>Javascript Calculator</h1>
        <Display 
          displayInput = {this.state.input}
          result = {this.state.result}
        />
        <Buttons 
          handleInput = {this.handleInput}
          clearDisplay = {this.clearDisplay}
          handleCalculation = {this.handleCalculation}
        /> 
      </div>
    );
  }
}

export default App;
