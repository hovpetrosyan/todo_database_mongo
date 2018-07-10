const todoScheme = require('./model');
const mongoose = require('mongoose');
todoScheme.statics.createToDo = function(todo,res){
	let todo_item = new TODO({
		todo:todo
	});
	todo_item.save().then(() => {TODO.AllDataSender(res);console.log('new ToDo saved! ')});
}
todoScheme.statics.AllDataSender = function(res){
	let data = this.find().then((data) => res.json({data:data}));
}
todoScheme.statics.deleteToDo = function(id,res){
	this.deleteOne({_id:id}).then(() => {TODO.AllDataSender(res); });
}
todoScheme.statics.updateToDo =function(id,data,res){
	this.update({_id:id},{$set:{todo:data}}).then(() => {TODO.AllDataSender(res);});
}
const TODO = mongoose.model('Todo',todoScheme);
module.exports = TODO;