import './styles.css'

const numberBtn = document.querySelectorAll('[data-number]')
const operationBtn = document.querySelectorAll('[data-operation]')
const allClearBtn = document.querySelector('[data-all-clear]')
const plusMinusBtn = document.querySelector('[data-plus-minus]')
const percentBtn = document.querySelector('[data-percent]')
const equalsBtn = document.querySelector('[data-equals]')
const outputElement = document.querySelector('.output-text')

let currentOperand = ''
let previousOperand = ''
let operation = null
let initialFontSize = parseFloat(window.getComputedStyle(outputElement).fontSize)

function clearOutput() {
  currentOperand = ''
  previousOperand = ''
  operation = null
  updateDisplay()
}

function appendNumber(number) {
  if (number === ',' && currentOperand.includes(',')) {
    return
  }
  if (currentOperand.length >= 16) {
    return
  }
  currentOperand = currentOperand.toString() + number.toString()
  setFontSize()
}

function chooseOperation(op) {
  if (currentOperand === '') {
    return
  }
  if (previousOperand !== '') {
    calculateResult()
  }
  operation = op
  previousOperand = currentOperand
  currentOperand = ''
  updateDisplay()
}

function calculateResult() {
  let result
  const prev = parseFloat(previousOperand.replace(',', '.'))
  const current = parseFloat(currentOperand.replace(',', '.'))
  if (isNaN(prev) || isNaN(current)) {
    return
  }
  if (operation === '÷' && current === 0) {
    currentOperand = 'Division by zero is not possible'
    operation = null
    previousOperand = ''

    const buttons = document.querySelectorAll('button')
    buttons.forEach((button) => {
      if (button.textContent !== 'AC' && button.textContent !== '=') {
        button.disabled = true
      }
    })

    setFontSize()
    return
  }
  switch (operation) {
    case '+':
      result = prev + current
      break
    case '-':
      result = prev - current
      break
    case '×':
      result = prev * current
      break
    case '÷':
      result = prev / current
      break
    default:
      return
  }
  currentOperand = Number.isInteger(result)
    ? result.toString().replace('.', ',')
    : result.toFixed(15).toString().replace(/0+$/, '').replace(/\./, ',').replace(/,+$/, ',0')
  operation = null
  previousOperand = ''
  setFontSize()
}

function updateDisplay() {
  outputElement.textContent = currentOperand
  if (operation) {
    outputElement.textContent = `${previousOperand} ${operation} ${currentOperand}`
  }
  setStartFontSize()
  setFontSize()
}

function setFontSize() {
  const parentWidth = outputElement.parentElement.offsetWidth
  let fontSize = parseFloat(window.getComputedStyle(outputElement).fontSize)
  while (outputElement.scrollWidth + 80 > parentWidth && fontSize > 10) {
    fontSize -= 1
    outputElement.style.fontSize = fontSize + 'px'
  }
}

function setStartFontSize() {
  outputElement.style.fontSize = initialFontSize + 'px'
}

function invertSign() {
  if (currentOperand) {
    currentOperand = (parseFloat(currentOperand.replace(',', '.')) * -1).toString().replace('.', ',')
    updateDisplay()
  }
}

function convertPercent() {
  if (currentOperand) {
    currentOperand = (parseFloat(currentOperand.replace(',', '.')) / 100).toString().replace('.', ',')
    updateDisplay()
  }
}

numberBtn.forEach((button) => {
  button.addEventListener('click', () => {
    appendNumber(button.textContent)
    updateDisplay()
  })
})

operationBtn.forEach((button) => {
  button.addEventListener('click', () => {
    chooseOperation(button.textContent)
    updateDisplay()
  })
})

allClearBtn.addEventListener('click', () => {
  clearOutput()
  const buttons = document.querySelectorAll('button')
  buttons.forEach((button) => {
    button.disabled = false
  })
})

plusMinusBtn.addEventListener('click', () => {
  invertSign()
})

percentBtn.addEventListener('click', () => {
  convertPercent()
})

equalsBtn.addEventListener('click', () => {
  if (currentOperand === 'Division by zero is not possible') {
    const allButtons = document.querySelectorAll('button')
    allButtons.forEach((button) => {
      button.disabled = false
    })
    currentOperand = ''
  }
  calculateResult()
  updateDisplay()
})
