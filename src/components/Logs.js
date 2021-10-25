import React from 'react'

const Logs = props => {
	let i = 0
	return (
		<>
			{props.data.map(log => {
				return <li key={i++}>{log}</li>
			})}
		</>
	)
}

export default Logs
