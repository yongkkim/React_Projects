import React from 'react';
import './TwoBlock.css';

const todo_key = "todo_";

class TwoBlock extends React.Component {
    constructor(prop) {
        super(prop);
        this.state = {
            input: "",
            todos: this.props.todoinfo === [] ? [] : this.props.todoinfo
        }
    }

    todoNum = 1;

    handleKeyPress = e => {
        if (e.key === "Enter") {
            this.handleCreate();
        }
    };

    handleCreate = () => {
        if (this.state.input === "") {
            alert("Cannot be empty");
        } else {
            this.setState({
                input: "",
                todos: this.state.todos.concat(this.state.input)
            });
        }
    };

    handleChange = e => {
        this.setState({
            input: e.target.value
        });
    };

    deleteToDo = (i) => {
        let copyToDos = [...this.state.todos];
        copyToDos.splice(i, 1);

        this.setState({
            todos: copyToDos
        })
    }

    clearToDo = () => {
        this.setState({
            todos: []
        })
    }

    render() {
        //console.log(this.state.todos);
        let eachTodo = ""
        if (this.state.todos !== []) {
            eachTodo = this.state.todos.map((todo, index) => {
                return <div key={todo_key + this.todoNum++} className="each-todo">
                    <span className="delete" onClick={e => { this.deleteToDo(index) }
                    }>X</span>
                    {todo}
                </div>
            })
        }

        return (
            <div className="schedule-container">
                <div className="container-title">
                    To-Do List
                </div>
                <div className="todos" style={{ height: this.props.height }}>
                    <input className="todoform" placeholder="Enter your task" value={this.state.input}
                        onChange={e => this.handleChange(e)} onKeyPress={e => this.handleKeyPress(e)} />
                    <hr className="text-primary" />
                    {eachTodo}
                </div>
                <div className="btn-container">
                    <div className="done bg-primary" onClick={e => this.props.toDoDone(this.state.todos)}>Done</div>
                    <div className="clear" onClick={e => this.clearToDo()}>Clear</div>
                </div>
            </div>
        );
    }
}

export default TwoBlock;
