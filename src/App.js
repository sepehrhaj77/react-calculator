import Calculator from './components/Calculator'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import Logs from './components/Logs'

function App() {
	const [logData, setLogData] = useState([])
	const [showLogs, setShowLogs] = useState(false)

	useEffect(() => {
		axios
			.get('http://localhost:4000/api/')
			.then(res => {
				let logsArray = []
				const data = res.data
				for (let i = 0; i < res.data.length; i++) {
					logsArray.push(data[i].log)
				}
				setLogData({ data: logsArray })
			})
			.catch(err => {
				console.log(err)
			})
	}, [showLogs])

	const loadLogs = () => {
		setShowLogs(true)
		const logsArray = logData.data
		logsArray.forEach(l => {
			console.log(l)
		})
	}

	return (
		<div className="App">
			<div id="container">
				<Calculator />
			</div>
			<button id="logs-button" onClick={loadLogs}>
				Show logs
			</button>
			<ul id="logs-container">{showLogs ? <Logs data={logData.data} /> : <p></p>}</ul>
		</div>
	)
}

export default App
