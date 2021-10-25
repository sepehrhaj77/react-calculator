const mongoose = require('mongoose')

const calculationSchema = new mongoose.Schema({
	log: String,
})

module.exports = mongoose.model('Calculation', calculationSchema)
