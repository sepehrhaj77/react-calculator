const express = require('express')
const app = express()
const port = process.env.PORT || 4000
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const Calculation = require('./models/calculation')

//bypass cors
app.use(cors())

//connect to database
mongoose
	.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(res => {
		console.log('DB Connected')
	})
	.catch(err => {
		console.error(err)
	})

//accept json body
app.use(express.json())

app.get('/api', async (req, res) => {
	try {
		const logs = await Calculation.find()
		res.json(logs)
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
})

app.post('/api', async (req, res) => {
	try {
		res.status(200).send('Successfully saved log')
	} catch (err) {
		res.status(400).json({ message: err.message })
	}
})

app.post('/api/calculateAnswer', async (req, res) => {
	try {
		const lhs = req.body.lhs
		const rhs = req.body.rhs
		const op = req.body.op
		let answer
		switch (op) {
			case '/':
				answer = parseFloat(lhs) / parseFloat(rhs)
				break
			case '*':
				answer = parseFloat(lhs) * parseFloat(rhs)
				break
			case '-':
				answer = parseFloat(lhs) - parseFloat(rhs)
				break
			case '+':
				answer = parseFloat(lhs) + parseFloat(rhs)
				break
			default:
				break
		}

		//log entire calculation to database
		const logString = `${lhs} ${op} ${rhs} = ${answer}`
		const log = new Calculation({ log: logString })
		await log.save()

		res.status(200).json({ answer: answer })
	} catch (err) {
		res.status(400).json({ message: err.message })
	}
})

app.listen(port, () => {
	console.log('server is running')
})
