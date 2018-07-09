const express = require('express');
const mongoose = require('mongoose');

const config_db = {
	host:'mongodb://localhost:',
	port:27017,
	name:'todo_db1'
};
let database_url = config_db.host + config_db.port+ '/' + config_db.name;
mongoose.connect(database_url);

const db = mongoose.connection;

db.once('open',function(){
	console.log('connection says:  I am ok bro ;Lets to do great things )');
});

const Schema = mongoose.Schema;

const todoScheme = new Schema({
	todo:String,
	myid:Number
});
todoScheme.statics.createToDo = function(todo,id,res){
	let todo_item = new TODO({
		todo:todo,
		myid:id
	});
	todo_item.save().then(() => {TODO.AllDataSender(res);console.log('new ToDo saved! ')});
}
todoScheme.statics.AllDataSender = function(res){
	let data = this.find().then((data) => res.json({data:data}));
}
todoScheme.statics.deleteToDo = function(id,res){
	this.deleteOne({myid:id}).then(() => {TODO.AllDataSender(res); });
}
todoScheme.statics.updateToDo =function(id,data,res){
	this.update({myid:id},{$set:{todo:data}}).then(() => {TODO.AllDataSender(res);});
}
const TODO = mongoose.model('Todo',todoScheme);

let todo_arr = [];
let id = 0;
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get('/',function(req,res){
	let f = fs.readFile('/public/index.html',(err,data) => {
		if (err) throw err;
		console.log(data);
		res.send(data);
	});
});

app.post('/api/todo/',function(req,res){
	console.log(req.body);
	if(req.body.data){
		TODO.createToDo(req.body.data,id++,res);
		//todo_arr.push({todo:req.body.data,id:id++});	
	}
	//res.json({data:todo_arr});

});
app.delete('/api/todo/:id',function(req,res){
	TODO.deleteToDo(req.params.id,res);
});
app.put('/api/todo/:id',function(req,res){
	TODO.updateToDo(req.params.id,req.body.data,res);
});
app.get('/api/todos',function(req,res){
	TODO.AllDataSender(res);
});
app.listen(3000);