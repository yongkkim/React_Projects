import React from 'react';
import './ThreeBlock.css';
import moment from 'moment';
import TwoBlock from '../blockTwo/TwoBlock';

class ThreeBlock extends React.Component {
    constructor(prop) {
        super(prop);
        this.state = {
            todo: this.props.todoall,
            selectedToDo: [],
            openBlockTwo: false,
            isToDo: false,
            index: -1,
            confirmDiv: false
        }
    }

    bottom = 0;

    set = (index, selected) => {
        // this.bottom = document.getElementById("existing_"+ selected.date);

        this.setState({
            openBlockTwo: true,
            selectedToDo: selected.todos,
            index: index,
            isToDo: selected.todos.length === 0 ? false : true //boolean to check if there are todos in a selected day
        })
    }
    delete = selected => {
        this.state.todo.forEach((each, i) => {
            if (each.date.isSame(selected.date)) {
                this.setState({
                    confirmDiv: true,
                    index: i
                })
            }
        })
    }

    openSchedule = () => {
        if (this.state.openBlockTwo) {
            return <TwoBlock todoinfo={this.state.selectedToDo} height={this.props.twoblockheight} toDoDone={this.toDoDone} compo={3} />
        } else {
            return null;
        }
    }

    toDoDone = (allToDos) => {
        let todowithdiv = allToDos.map(todo => {
            return todo
        });

        let changedToDo = Object.assign([], this.state.todo);

        if (allToDos.length === 0) {
            changedToDo.splice(this.state.index - 1, 1);

            this.setState({
                openBlockTwo: false,
                todo: changedToDo
            })
        } else if (this.state.isToDo) {
            changedToDo[this.state.index - 1].todos = todowithdiv;

            this.setState({
                openBlockTwo: false,
                todo: changedToDo
            })
        } else {
            let changedToDo = Object.assign([], this.state.todo);
            changedToDo.push({
                date: new moment(this.currentYear() + "-" + moment().month(this.currentMonth()).format("MM") + "-" + this.state.currentDayNum),
                todos: todowithdiv
            });

            //sorting
            changedToDo = this.props.sort(changedToDo);

            this.setState({
                openBlockTwo: false,
                todo: changedToDo
            })
        }
    }

    handleEnter = id => {
        let source = document.getElementById(id).clientWidth;
        let targetted = document.getElementById(id).lastElementChild;
        targetted.setAttribute("style", "display: flex;");
        for (let i = 0; i < targetted.getElementsByTagName('div').length; i++) {

            targetted.getElementsByTagName('div')[i].style.width = source / 2 + "px";
        }
    }

    confirmation = yesorno => {

        if (yesorno) {
            let changedToDo = Object.assign([], this.state.todo)
            changedToDo.splice(this.state.index, 1);
            console.log(changedToDo);

            this.setState({
                confirmDiv: false,
                todo: changedToDo
            })
        } else {
            this.setState({
                confirmDiv: false
            })
        }

    }

    render() {
        let todosinmonth = [];
        let todoList = this.state.todo;

        for (let i = 0; i < todoList.length; i++) {
            let currentMonthtodos = [];
            let todosinEachMonth = [];
            let month = todoList[i].date.format("MM");
            let index = i;
            while (index < todoList.length && todoList[index].date.format("MM") === month) {
                todosinEachMonth.push(todoList[index]);
                index++;
            }
            todosinEachMonth.forEach(todo => {
                currentMonthtodos.push(<td key={"existing_" + todo.date} id={"existing_" + todo.date} className="item"
                    onMouseEnter={e => {
                        let elementID = e.currentTarget.id;
                        this.handleEnter(elementID);
                    }
                    } onMouseLeave={e => {
                        let elementID = e.currentTarget.id;
                        this.props.mouseLeave(elementID)
                    }
                    }>
                    <p>{todo.date.format("D")}</p>
                    <div className="option-container for-three">
                        <div className="delete-todo" onClick={e => {
                            e.stopPropagation();
                            this.delete(todo)
                        }
                        }>Delete</div>
                        <div className="view-todo bg-primary" onClick={e => {
                            e.stopPropagation();
                            this.set(index, todo)
                        }
                        }>View</div>
                    </div>
                </td>);
            })
            let daysinmonth = this.props.getRows(currentMonthtodos, 3);

            let year_month_todos = <div key={i} className={this.state.confirmDiv ? "list-todos-container cal-blur for-three-cal-blur" : "list-todos-container"}>
                <div className="list-item-title">{todoList[index - 1].date.format("YYYY MMMM")}</div>
                <table className="calendar-todos">
                    <thead>
                        <tr>
                            <th className="four-rows"></th>
                            <th className="four-rows"></th>
                            <th className="four-rows"></th>
                            <th className="four-rows"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {daysinmonth}
                    </tbody>
                </table>
            </div>

            todosinmonth.push(year_month_todos);

            i = index < todoList.length - 1 ? index - 1 : todoList.length;
        }

        return (
            <div className="three-container" ref={(divThree) => this.divThree = divThree}>
                {this.openSchedule()}
                {this.state.confirmDiv &&
                    <div className="confirm-container for-three-confirm">
                        Are you sure you delete this?
                            <div className="yesorno-container">
                            <button className="yes btn-success" onClick={e => this.confirmation(true)}>Yes</button>
                            <button className="no btn-danger" onClick={e => this.confirmation(false)}>No</button>
                        </div>
                    </div>
                }
                <div style={{ height: this.props.height }} className={this.state.confirmDiv ? "list-of-todos confirm-active" : "list-of-todos"}>
                    <div className="list-name">List of All To-Dos in the Calendar</div>
                    <br />
                    {todosinmonth}
                </div>
                <div className="doneManage bg-primary" onClick={e => this.props.done(this.state.todo)}>Done</div>
            </div>
        );
    }
}

export default ThreeBlock;

