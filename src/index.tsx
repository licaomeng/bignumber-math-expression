import BN from 'bignumber.js'
import invariant from 'invariant'
const bn = val => new BN(val)

// Algorithm from http://csis.pace.edu/~wolf/CS122/infix-postfix.htm
function infixToPostfix(exp) {
  const infix = exp.match(/(\*\*)|[\+\-\*\/\%\(\)]|([0-9]+([\.][0-9]+)?)/g);
  const presedences = ['-', '+', '**', '*', '/', '%'];

  let opsStack: any[] = [];
  let postfix: any[] = [];

  for (let token of infix) {
    // Step 1
    if (typeof Number(token) === 'number' && isFinite(token)) {
      postfix.push(token); continue;
    }
    let topOfStack = opsStack[opsStack.length - 1];
    // Step 2
    if (!opsStack.length || topOfStack == '(') {
      opsStack.push(token); continue;
    }
    // Step 3
    if (token == '(') {
      opsStack.push(token); continue;
    }
    // Step 4
    if (token == ')') {
      while (opsStack.length) {
        let op = opsStack.pop();
        if (op == '(') break;
        postfix.push(op);
      }
      continue;
    }
    // Step 5
    let prevPresedence = presedences.indexOf(topOfStack);
    let currPresedence = presedences.indexOf(token);
    while (currPresedence < prevPresedence) {
      let op = opsStack.pop();
      postfix.push(op);
      prevPresedence = presedences.indexOf(opsStack[opsStack.length - 1]);
    }
    opsStack.push(token);
  }
  // Step 6
  while (opsStack.length) {
    let op = opsStack.pop();
    if (op == '(') break;
    postfix.push(op);
  }

  return postfix;
}

const operatorMap = {
  '**': 'pow',
  '+': 'plus',
  '-': 'minus',
  '*': 'times',
  '/': 'div',
  '%': 'mod'
}

function evaluatePostfixExp(postfix) {
  for (let [index, token] of postfix.entries()) {
    if (/\+|\-|\*\*|\*|\/|\%/.test(token)) {
      let grainExp = ''

      if (/^[0-9]+([\.][0-9]+)?$/.test(postfix[index - 2])) {
        grainExp = `bn(${postfix[index - 2]}).${operatorMap[token]}(${postfix[index - 1]})`
      } else {
        grainExp = `${postfix[index - 2]}.${operatorMap[token]}(${postfix[index - 1]})`
      }

      postfix[index] = grainExp
      postfix.splice(index - 2, 2)

      if (1 === postfix.length) {
        break;
      }
      evaluatePostfixExp(postfix)
    }
  }
  return `${postfix}.toString()`
}

module.exports = (exp) => {
  const operators = Object.keys(operatorMap)
  const operands = operators
    .reduce((ret, op) => ret.replace(op, ' '), exp)
    .split(/\s+/)
  invariant(operands.every(item => {
    const op = Number(item)
    return (typeof op === 'number' && !isNaN(op) && isFinite(op)) || typeof op === 'boolean'
  }), 'Operands must be number or boolean.')
  return eval(evaluatePostfixExp(infixToPostfix(exp)))
}