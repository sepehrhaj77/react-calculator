import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Calculator = () => {
	const [lhs, setLhs] = useState('0')
	const [rhs, setRhs] = useState('0')
	const [firstInput, setFirstInput] = useState(true)
	const [operator, setOperator] = useState('')
	const [result, setResult] = useState('')
	const [hasDecimal, setHasDecimal] = useState(false)
	const [afterDecimalCount, setAfterDecimalCount] = useState(0)
	const [equalsPressed, setEqualsPressed] = useState(false)

	//initial load
	useEffect(() => {
		disableOperators()
		document.querySelector('#equals-button').setAttribute('disabled', true)
	}, [])

	//on LHS number change
	useEffect(() => {
		if (lhs !== '0') {
			enableOperators()
		}
	}, [lhs])

	//on RHS number change
	useEffect(() => {
		if (rhs !== '0') {
			disableOperators()
			document.querySelector('#equals-button').removeAttribute('disabled')
		}
	}, [rhs])

	//on result change, aka 'equals' button is pressed
	useEffect(() => {
		document.querySelector('.display').innerText = result
		document.querySelector('#equals-button').setAttribute('disabled', true)
	}, [result])

	const enableOperators = () => {
		const ops = document.querySelectorAll('.operators')
		ops.forEach(op => {
			op.removeAttribute('disabled')
		})
	}

	const disableOperators = () => {
		const ops = document.querySelectorAll('.operators')
		ops.forEach(op => {
			op.setAttribute('disabled', true)
		})
	}

	const clearDisplay = () => {
		setLhs('0')
		setRhs('0')
		setFirstInput(true)
		setOperator('')
		setResult(0)
		setHasDecimal(false)
		setAfterDecimalCount(0)
		disableOperators()
		setEqualsPressed(false)
	}

	const numInput = e => {
		//if we pressed equal to get an answer, next time we click a digit reset everything and then accept the value
		if (equalsPressed) {
			clearDisplay()
		}

		//LEFT HAND SIDE
		//change number from zero if first digit
		if (lhs === '0' && firstInput) {
			setLhs(e.target.innerText)
		}
		//if not first digit, tack on extra digits
		else if (firstInput) {
			//if the decimal has been clicked, keep track. After 2 digits dont update the value anymore
			if (hasDecimal) {
				setAfterDecimalCount(afterDecimalCount + 1)
			}
			if (afterDecimalCount < 2) {
				setLhs(lhs + e.target.innerText)
			}
		}

		//RIGHT HAND SIDE
		else {
			if (rhs === '0') {
				setRhs(e.target.innerText)
			} else {
				if (hasDecimal) {
					setAfterDecimalCount(afterDecimalCount + 1)
				}
				if (afterDecimalCount < 2) {
					setRhs(rhs + e.target.innerText)
				}
			}
		}
	}

	const addDecimal = () => {
		//if a decimal has already been inserted, do nothing
		if (hasDecimal) {
		}
		//otherwise, add a decimal
		else {
			//if we are on the first operand
			if (firstInput) {
				setHasDecimal(true)
				setLhs(`${lhs}.`)
			} else {
				setHasDecimal(true)
				setRhs(`${rhs}.`)
			}
		}
	}

	const changeOperator = e => {
		setOperator(e.target.innerText)
		setRhs('0')
		setFirstInput(false)
		setHasDecimal(false)
		setAfterDecimalCount(0)
	}

	const calculateAnswer = async () => {
		try {
			const res = await axios.post('http://localhost:4000/api/calculateAnswer', {
				lhs,
				rhs,
				op: operator,
			})
			const answer = res.data
			setResult(answer.answer)
			setEqualsPressed(true)
			document.querySelector('#equals-button').setAttribute('disabled', true)
		} catch (err) {
			console.log(err)
		}
	}

	const plusMinus = () => {
		if (firstInput) {
			setLhs('' + lhs * -1)
		} else {
			setRhs('' + rhs * -1)
		}
	}

	return (
		<div id="calculator-wrapper">
			<div className="display">{firstInput ? lhs : rhs}</div>
			<div className="row">
				<button className="grid-button special-buttons" onClick={clearDisplay}>
					C
				</button>
				<button className="grid-button special-buttons" onClick={plusMinus}>
					<sup>+</sup>/<sub>&minus;</sub>
				</button>
				<button className="grid-button special-buttons" disabled>
					%
				</button>
				<button id="divide-button" className="grid-button operators" onClick={changeOperator}>
					/
				</button>
			</div>

			<div className="row">
				<button className="grid-button number-buttons" onClick={numInput}>
					7
				</button>
				<button className="grid-button number-buttons" onClick={numInput}>
					8
				</button>
				<button className="grid-button number-buttons" onClick={numInput}>
					9
				</button>
				<button id="times-button" className="grid-button operators" onClick={changeOperator}>
					*
				</button>
			</div>
			<div className="row">
				<button className="grid-button number-buttons" onClick={numInput}>
					4
				</button>
				<button className="grid-button number-buttons" onClick={numInput}>
					5
				</button>
				<button className="grid-button number-buttons" onClick={numInput}>
					6
				</button>
				<button id="minus-button" className="grid-button operators" onClick={changeOperator}>
					-
				</button>
			</div>
			<div className="row">
				<button className="grid-button number-buttons" onClick={numInput}>
					1
				</button>
				<button className="grid-button number-buttons" onClick={numInput}>
					2
				</button>
				<button className="grid-button number-buttons" onClick={numInput}>
					3
				</button>
				<button id="plus-button" className="grid-button operators" onClick={changeOperator}>
					+
				</button>
			</div>
			<div className="row">
				<button className="grid-button number-buttons" id="zero-button" onClick={numInput}>
					0
				</button>
				<button className="grid-button number-buttons" onClick={addDecimal}>
					.
				</button>
				<button className="grid-button" id="equals-button" onClick={calculateAnswer}>
					=
				</button>
			</div>
		</div>
	)
}

export default Calculator
