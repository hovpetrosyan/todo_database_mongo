function render(App,data=''){
	const props = {
		header: 'TODO APP',
		add: 'ADD',
		del:'DELETE',
		edit:'SAVE',
		data:data
	};
	const app = new App(props);
	let root = document.getElementById('root');
	root.innerHTML += app.render();

}

class Component {
	constructor(props){
		this.props = props;
		window.sendReq = this.sendReq;
	}
	sendReq(method,id=''){
	let data = document.getElementById('inp').value;
	if(method == 'put')
	{
		 data = document.getElementById(id).value;
		 console.log(data);
	}
	let url = '/api/todo/' + id;
	console.log(url);
	fetch(url ,{
		method:method,
		headers: {
			"Content-Type": "application/json"
		},
		body:JSON.stringify({data:data})
		}).then(function(res){
		 			console.log(res);
		 			res.json().then(function(data){
		 				console.log(data.data);
		 					let arr = data.data;
		 					if(document.getElementById('main_table')){
		 						document.getElementById('root').removeChild(document.getElementById('main_table'));
		 					}
		 					render(Table,arr);
		 					document.getElementById('inp').focus();
		 					
		 		})
		 		})
		.catch(function(res){
			 console.log(res) 
			});
	}
}

class Header extends Component{
	constructor(props){
		super(props)
	}
	render(){
		const {header} = this.props;
		return '<h1>' + header + '</h1>'; 
	}
}

class TODO extends Component{
	constructor(props){
		super(props)
		
	}

	render(){
		const {add} = this.props;
		return '<input name = "todo" id = "inp" /><button class="add" onclick="sendReq('+"'post'"+')" >'+add+'</button>';
	}
}

class Table extends Component{
	constructor(props){
		super(props)
		this.mapItemToRow = this.mapItemToRow.bind(this);
	}


	mapItemsToRows() {
		const {mapItemToRow} = this;
		const {data} = this.props;
		return data.map(mapItemToRow);
	}

	mapItemToRow(item) {
		const {del, edit} = this.props;
		let todo = item.todo;
		return `<tr><td><input name="todo" id="${item._id}" value ="${todo}"></td><td><button class="add" onclick="sendReq('put','${item._id}')">${edit}</button></td><td><button class="add" onclick="sendReq('delete', '${item._id}')">${del}</button></td><tr>`;
	}

	render(){
		const {data,edit,del} = this.props;
		let display = '<table id = "main_table">';
		display += this.mapItemsToRows().join("");
		display+='</table>';
		return  display;
	}
}
render(Header);
render(TODO);
fetch('/api/todos',{
		method:'get',
		headers: {
			"Content-Type": "application/json"
		},
		}).then(function(res){
		 			console.log(res);
		 			return res.json()
		 		})
		.then(function(data){
		 				console.log(data.data);
		 					let arr = data.data;
		 					if(document.getElementById('main_table')){
		 						document.getElementById('root').removeChild(document.getElementById('main_table'));
		 					}
		 					render(Table,arr);
							document.getElementById('inp').focus();

		 					
		 		})
		.catch(function(res){
			 console.log(res) 
			});
document.addEventListener('keypress',function(e) {
	
	if(e.keyCode == 13){
		sendReq('post');
	}
}); 