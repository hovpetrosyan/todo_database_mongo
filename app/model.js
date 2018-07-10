
const db = require('./db');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoScheme = new Schema({
	todo:String
});

module.exports = todoScheme;