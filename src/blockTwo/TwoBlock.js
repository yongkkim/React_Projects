import React from 'react';
import './TwoBlock.css';
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const todo_key = "todo_";

class TwoBlock extends React.Component {
    constructor(prop) {
        super(prop);
        this.state = {
            input: "",
            todos: this.props.todoinfo === [] ? [] : this.props.todoinfo,
            savedTodos: [],
            undoDesc: "OK"
        }
    }

    todoNum = 1;

    handleKeyPress = e => {
        if (e.key === "Enter") {
            this.handleCreate();
        }
    };

    handleEnter = () => {
        this.handleCreate();
    }

    handleCreate = () => {
        if (this.state.input === "") {
            alert("Cannot be empty");
        } else {
            let tobeSaved = [...this.state.todos];
            this.setState({
                savedTodos: tobeSaved,
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
        let tobeSaved = [...this.state.todos];
        copyToDos.splice(i, 1);

        this.setState({
            savedTodos: tobeSaved,
            todos: copyToDos
        })
    }

    clearToDo = () => {
        let tobeSaved = [...this.state.todos];
        this.setState({
            savedTodos: tobeSaved,
            todos: []
        })
    }

    undo = () => {
        this.setState({
            todos: this.state.savedTodos
        })
    }

    disappear = () => {
        this.setState({
            undoDesc: "Closing"
        })

    }

    render() {
        let eachTodo = ""
        if (this.state.todos !== []) {
            // console.log(this.state.todos);
            eachTodo = this.state.todos.map((todo, index) => {
                return <div key={todo_key + this.todoNum++} className="each-todo">
                    <span className="delete" onClick={e => { this.deleteToDo(index) }
                    }>X</span>
                    {todo}
                </div>
            })
        }

        return (
            <div className={this.props.compo === 1 ? "schedule-container zero-top" : "schedule-container zero-bottom"}>
                {/* <ReactCSSTransitionGroup transitionName="undoDesc"
                    transitionAppear={true}
                    transitionAppearTimeout={1000}
                    transitionEnter={true}
                    transitionEnterTimeout={1000}
                    transitionLeave={true}
                    transitionLeaveTimeout={1000}
                >
                    <div key={"undo-btn-info" + this.state.undoDesc} id="undo-btn-info" className="bg-info">
                        After adding, deleting, or clearing, Undo button can't be used consequtively (one at a time).
                        After above three actions, Undo button works only once to restore the preceding data<br key={"br" + this.state.undoDesc} />
                        <button key={"undo-btn-ok" + this.state.undoDesc} id="undo-btn-ok" className="btn-danger"
                            onClick={e => this.disappear()}>{this.state.undoDesc}</button>
                    </div>
                </ReactCSSTransitionGroup> */}
                <div className="container-title">
                    To-Do List
                </div>
                <div className="todos" style={{ height: this.props.height }}>
                    <div className="input-group">
                        <input className="todoform" placeholder="Enter your task" value={this.state.input}
                            onChange={e => this.handleChange(e)} onKeyPress={e => this.handleKeyPress(e)} />
                        <div className="add btn-danger" onClick={e => this.handleEnter()}>ENTER</div>
                    </div>
                    <hr className="text-primary" />
                    {eachTodo}
                </div>
                <div className="btn-container">
                    <div className="done bg-primary" onClick={e => this.props.toDoDone(this.state.todos)}>Done</div>
                    <div className="clear" onClick={e => this.clearToDo()}>Clear</div>
                    <div className="undo" onClick={e => this.undo()}>Undo</div>
                </div>
            </div>
        );
    }
}

export default TwoBlock;