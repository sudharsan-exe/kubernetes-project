import React, { useState } from 'react'

function Button({ className, children, onClick }) {
  return (
    <button className={className} onClick={() => onClick && onClick(children)}>{children}</button>
  )
}

export default function App() {
  const [display, setDisplay] = useState('0')
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [operator, setOperator] = useState(null)
  const [value, setValue] = useState(null)

  function inputDigit(digit) {
    if (display === 'Error') {
      setDisplay(String(digit))
      setWaitingForOperand(false)
      return
    }
    if (waitingForOperand) {
      setDisplay(String(digit))
      setWaitingForOperand(false)
    } else {
      setDisplay(prev => (prev === '0' ? String(digit) : prev + digit))
    }
  }

  function inputDot() {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
    } else if (!display.includes('.')) {
      setDisplay(prev => prev + '.')
    }
  }

  function clearAll() {
    setDisplay('0')
    setValue(null)
    setOperator(null)
    setWaitingForOperand(false)
  }

  function toggleSign() {
    setDisplay(prev => (prev.charAt(0) === '-' ? prev.slice(1) : '-' + prev))
  }

  function inputPercent() {
    const current = parseFloat(display)
    if (isNaN(current)) return
    const v = current / 100
    setDisplay(formatNumber(v))
  }

  function formatNumber(n) {
    if (typeof n !== 'number' || Number.isNaN(n) || !isFinite(n)) return String(n)
    // round to 4 decimal places and trim trailing zeros
    const s = n.toFixed(4)
    // remove unnecessary trailing zeros and optional trailing dot
    return s.replace(/(?:\.0+|(?<=\.[0-9]*?)0+)$/, '').replace(/\.$/, '')
  }

  function performOperation(nextOperator) {
    const inputValue = parseFloat(display)

    if (isNaN(inputValue)) {
      setDisplay('Error')
      setValue(null)
      setOperator(null)
      setWaitingForOperand(true)
      return
    }

    // If user pressed an operator immediately after another operator, just change operator
    if (operator && waitingForOperand) {
      if (nextOperator === null) {
        // '=' pressed without a second operand; show current value
        setDisplay(String(value != null ? value : inputValue))
        setOperator(null)
      } else {
        setOperator(nextOperator)
      }
      return
    }

    if (value == null) {
      setValue(inputValue)
    } else if (operator) {
      const currentValue = value
      let newValue
      if (operator === '+') newValue = currentValue + inputValue
      else if (operator === '-') newValue = currentValue - inputValue
      else if (operator === '*') newValue = currentValue * inputValue
      else if (operator === '/') {
        if (inputValue === 0) {
          setDisplay('Error')
          setValue(null)
          setOperator(null)
          setWaitingForOperand(true)
          return
        }
        newValue = currentValue / inputValue
      }

      setValue(newValue)
      setDisplay(formatNumber(newValue))
    }

    setWaitingForOperand(true)
    setOperator(nextOperator)
  }

  // helper to build expression string for top bar
  const expression = () => {
    if (value == null && !operator) return ''
    if (value != null && operator && waitingForOperand) return `${value}${operator}`
    if (value != null && operator) return `${value}${operator}${display}`
    return display
  }

  return (
    <div className="app">
      <div className="card classic">
        <div className="expr">{expression()}</div>
        <div className="display classic-display">{display}</div>
        <div className="keypad">
          <Button className="btn btn-fn" onClick={clearAll}>AC</Button>
          <Button className="btn btn-fn" onClick={toggleSign}>+/-</Button>
          <Button className="btn btn-fn" onClick={inputPercent}>%</Button>
          <Button className="btn btn-op" onClick={() => performOperation('/')}>÷</Button>

          <Button className="btn" onClick={() => inputDigit(7)}>7</Button>
          <Button className="btn" onClick={() => inputDigit(8)}>8</Button>
          <Button className="btn" onClick={() => inputDigit(9)}>9</Button>
          <Button className="btn btn-op" onClick={() => performOperation('*')}>×</Button>

          <Button className="btn" onClick={() => inputDigit(4)}>4</Button>
          <Button className="btn" onClick={() => inputDigit(5)}>5</Button>
          <Button className="btn" onClick={() => inputDigit(6)}>6</Button>
          <Button className="btn btn-op" onClick={() => performOperation('-')}>−</Button>

          <Button className="btn" onClick={() => inputDigit(1)}>1</Button>
          <Button className="btn" onClick={() => inputDigit(2)}>2</Button>
          <Button className="btn" onClick={() => inputDigit(3)}>3</Button>
          <Button className="btn btn-op" onClick={() => performOperation('+')}>+</Button>

          <Button className="btn btn-zero" onClick={() => inputDigit(0)}>0</Button>
          <Button className="btn" onClick={inputDot}>.</Button>
          <Button className="btn btn-op" onClick={() => performOperation(null)}>=</Button>
        </div>
      </div>
    </div>
  )
}
