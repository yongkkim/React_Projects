import React, { useState } from 'react';
import './OneBlock.css';
import moment from 'moment';
import TwoBlock from '../blockTwo/TwoBlock';
import ThreeBlock from '../blockThree/ThreeBlock';
import Cookies from 'universal-cookie';
import { CSSTransition } from "react-transition-group";

const cookies = new Cookies();
// const [count, setCount] = useState(0); react hooks


class OneBlock extends React.Component {
    constructor(prop) {
        super(prop);
        this.state = {
            dateObject: moment(),
            monthDiv: false, // boolean for toggling down month selection div
            yearDiv: false, // boolean for toggling down year selection div
            toDoOpen: false, // boolean for opening todo div
            currentMonth: "",
            currentDayNum: "",
            height: 0, // props for setting height in todo component
            daysWithToDo: cookies.get("todos") === undefined ? [] : cookies.get("todos"), // save all todo objects
            todos: [],// props for a list of todos
            index: "", //index of object in daysWithToDo
            isToDo: false, // check if there are todos in a selected day
            optionDiv: false,
            todoDiv: false
        }
    }

    weekdayshort = moment.weekdaysShort();
    year = moment().format("YYYY");

    componentDidMount() {
        const oneHeight = this.divElement.clientHeight - this.divele.clientHeight * 2;
        this.setState({
            height: oneHeight
        });
    }

    currentYear = () => {
        return this.state.dateObject.format("YYYY");
    }

    setYear = () => {
        this.setState({
            yearDiv: !this.state.yearDiv
        })
    }

    setCurrentYear = (selectedYear) => {
        let changedData = Object.assign({}, this.state.dateObject);
        changedData = moment(changedData).set("year", selectedYear);

        this.setState({
            dateObject: changedData,
            yearDiv: false
        })
    }

    yearList = () => {
        let years = moment().add(11, "year").format("Y");
        var dateArray = [];
        var currentDate = moment(this.year);
        var stopDate = moment(years);
        while (currentDate <= stopDate) {
            dateArray.push(moment(currentDate).format("YYYY"));
            currentDate = moment(currentDate).add(1, "year");
        }

        let yearList = dateArray.map(year => {
            return (
                <div key={year} className={this.currentYear() === year ? "year current" : "year"} onClick={e => this.setCurrentYear(year)} >
                    {year}
                </div>
            )
        })

        return yearList;
    }

    setMonth = () => {
        this.setState({
            monthDiv: !this.state.monthDiv
        })
    }

    setCurrentMonth = (selectedMonth) => {
        let index = moment.months().indexOf(selectedMonth);
        let changedData = Object.assign({}, this.state.dateObject);
        changedData = moment(changedData).set("month", index);

        this.setState({
            dateObject: changedData,
            monthDiv: false
        })
    }

    currentMonth = () => {
        return this.state.dateObject.format("MMMM");
    }

    monthList = () => {
        let monthList = moment.months().map(month => {
            return (
                <div key={month} className={this.currentMonth() === month ? "month current" : "month"} onClick={e => this.setCurrentMonth(month)} >
                    {month}
                </div>
            )
        })

        return monthList;
    }

    currentDay = () => {
        return this.state.dateObject.format("D").toUpperCase;
    };

    firstDayOfMonth = () => {
        let dateObject = this.state.dateObject;
        let firstDay = moment(dateObject).startOf("month").format("d");
        return firstDay;
    };

    daysInMonth = () => {
        return this.state.dateObject.daysInMonth();
    }

    setToDo = (dayNum, content, checkToDo) => {
        this.setState({
            toDoOpen: true,
            currentDayNum: dayNum,
            todos: content.todoList,
            index: content.nthObject,
            isToDo: checkToDo //boolean to check if there are todos in a selected day
        })
    }

    openSchedule = () => {
        if (this.state.toDoOpen) {
            return <TwoBlock todoinfo={this.state.todos} height={this.state.height} toDoDone={this.toDoDone} />
        } else {
            return null;
        }
    }

    toDoDone = (allToDos) => {
        if (allToDos.length === 0) {
            let changedToDo = Object.assign([], this.state.daysWithToDo)
            changedToDo.splice(this.state.index, 1);

            this.setState({
                toDoOpen: false,
                daysWithToDo: changedToDo
            })

        } else {
            let todowithdiv = allToDos.map(todo => {
                return todo
            });

            let toDoObject = {
                year: this.currentYear(),
                month: this.currentMonth(),
                day: this.state.currentDayNum,
                todos: todowithdiv
            }

            let changedToDo = Object.assign([], this.state.daysWithToDo)
            changedToDo.forEach((ctd, i) => {
                if (i === this.state.index) {
                    ctd.toDoObject = toDoObject;
                }
            })

            this.setState({
                toDoOpen: false,
                daysWithToDo: this.state.isToDo ? changedToDo : this.state.daysWithToDo.concat({ toDoObject })
            })

        }
    }

    handleEnter = (id) => {
        let targetted = document.getElementById(id).lastElementChild;
        targetted.setAttribute("style", "display: flex;");
    }

    handleLeave = id => {
        let targetted = document.getElementById(id).lastElementChild;
        targetted.setAttribute("style", "display: none;");
    }

    quickDelete = tobeDeleted => {
        console.log(tobeDeleted.nthObject);
        let changedToDo = Object.assign([], this.state.daysWithToDo)
        changedToDo.splice(tobeDeleted.nthObject, 1);

        this.setState({
            toDoOpen: false,
            daysWithToDo: changedToDo
        })
    }

    openToDoList = () => {
        this.setState({
            todoDiv: true
        })
    }

    render() {
        // cookies.remove("todos", { path: "/" });
        cookies.set("todos", this.state.daysWithToDo, { path: '/', expires: new Date(Date.now() + 2592000) });
        let weekdayshortname = this.weekdayshort.map(day => {
            return (
                <th key={day} className="week-day bg-primary">
                    {day}
                </th>
            );
        });

        let blankDays = [];
        for (let i = 0; i < this.firstDayOfMonth(); i++) {
            blankDays.push(
                <td key={"empty_" + i} className="calendar-day empty">{""}</td>
            );
        }

        let daysInMonth = [];
        for (let d = 1; d <= this.daysInMonth(); d++) {
            let withToDo = ""
            //let todoInfo = this.setToDoBgColor(d);

            //body of function -> setToDoBgColor(d)
            let todoInfo = {};
            let todoList = [];
            let objNum;
            let found = false;
            if (this.state.daysWithToDo.length !== 0) {
                this.state.daysWithToDo.forEach((obj, index) => {
                    if (obj.toDoObject.year === this.currentYear() && obj.toDoObject.month === this.currentMonth() &&
                        d === obj.toDoObject.day) {
                        found = true;
                        objNum = index;
                        todoList = obj.toDoObject.todos.map(todo => {
                            return todo
                        });
                        todoInfo = {
                            todoList: todoList,
                            nthObject: objNum
                        }
                        // console.log(todoInfo, index, d);
                    }
                    if (!found) {
                        todoInfo = {
                            todoList: todoList,
                            nthObject: -1
                        }
                        // console.log(todoInfo, index, d);
                    }
                })
            } else {
                todoInfo = {
                    todoList: todoList,
                    nthObject: -1
                }
            }
            //end
            if (todoList.length !== 0) {
                // console.log(todoInfo, d);
                withToDo = <td key={d} id={d} className={"calendar-day has-todo"} onClick={e => this.setToDo(d, todoInfo, true)}
                    onMouseEnter={e => {
                        let elementID = e.currentTarget.id;
                        this.handleEnter(elementID);
                    }
                    } onMouseLeave={e => {
                        let elementID = e.currentTarget.id;
                        this.handleLeave(elementID)
                    }
                    }>
                    <p>{d}</p>
                    <div className="option-container">
                        <div className="delete-todo" onClick={e => {
                            e.stopPropagation();
                            this.quickDelete(todoInfo)
                        }
                        }>Delete</div>
                        <div className="view-todo bg-primary" onClick={e => {
                            e.stopPropagation();
                            this.setToDo(d, todoInfo, true)
                        }
                        }>View</div>
                    </div>
                </td>
            } else {
                withToDo = <td key={d} className={"calendar-day"} onClick={e => this.setToDo(d, todoInfo, false)} ><p>{d}</p></td>
            }
            daysInMonth.push(withToDo);
        }

        var totalSlots = [...blankDays, ...daysInMonth];
        let rows = [];
        let cells = [];

        totalSlots.forEach((row, i) => {
            if (i % 7 !== 0) {
                cells.push(row); // if index not equal 7 that means not go to next week
            } else {
                rows.push(cells); // when reach next week we contain all td in last week to rows 
                cells = []; // empty container 
                cells.push(row); // in current loop we still push current row to new container
            }
            if (i === totalSlots.length - 1) { // when end loop we add remain date
                rows.push(cells);
            }
        });

        let daysinmonth = rows.map((d, i) => {
            return <tr key={"days_" + i} className="days cal-container">{d}</tr>;
        });

        return (
            <div ref={(divElement) => this.divElement = divElement}>
                {this.openSchedule()}
                <div className="calendar-year bg-primary" onClick={e => this.setYear()}>
                    <p>{this.currentYear()}</p>
                </div>
                {this.state.yearDiv &&
                    <div className="year-selection">{this.yearList()}</div>
                }
                <div ref={(divele) => this.divele = divele} className="calendar-month" onClick={e => this.setMonth()}>
                    <p>{this.currentMonth().toLocaleUpperCase()}</p>
                </div>
                {this.state.monthDiv &&
                    <div className="month-selection">{this.monthList()}</div>
                }
                <table className={this.state.monthDiv || this.state.yearDiv ? "calendar cal-blur" : "calendar"}>
                    <thead>
                        <tr className="weekday cal-container">
                            {weekdayshortname}
                        </tr>
                    </thead>
                    <tbody>
                        {daysinmonth}
                    </tbody>
                </table>
                <div className="all-todos" onClick={e => this.openToDoList()}>Check All To-Do</div>
                {this.state.todoDiv && <ThreeBlock todoall={this.state.daysWithToDo} />}
            </div>
        );
    }
}

export default OneBlock;
