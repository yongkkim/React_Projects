import React from 'react';
import './OneBlock.css';
import moment from 'moment';
import TwoBlock from '../blockTwo/TwoBlock';
import ThreeBlock from '../blockThree/ThreeBlock';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
// const [count, setCount] = useState(0); react hooks
// cookies.remove("todos");

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
            daysWithToDo: cookies.get("todos") === undefined ? [] : cookies.get("todos"), // save all todo objects
            todos: [],// props for a list of todos
            index: "", //index of object in daysWithToDo
            isToDo: false, // check if there are todos in a selected day
            optionDiv: false,
            todoDiv: false,
            confirmDiv: false
        }


        if (cookies.get("todos") !== undefined) {
            this.state.daysWithToDo.forEach(todo => {
                todo.date = new moment(todo.date);
            })
        }
    }

    weekdayshort = moment.weekdaysShort();
    year = moment().format("YYYY");
    heightThree = 0;
    styleTop = 0;
    height = 0;
    btn = 0;

    componentDidMount() {
        this.styleTop = this.tdlist.clientTop;
        this.height = this.divElement.clientHeight - this.divele.clientHeight * 2.5;
        this.heightThree = this.divElement.clientHeight - this.divele.clientHeight;
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
            return <TwoBlock todoinfo={this.state.todos} height={this.height} toDoDone={this.toDoDone} compo={1} />
        } else {
            return null;
        }
    }

    toDoDone = (allToDos) => {
        let todowithdiv = allToDos.map(todo => {
            return todo
        });

        let changedToDo = Object.assign([], this.state.daysWithToDo);

        if (this.state.isToDo) {
            if (allToDos.length === 0) {
                changedToDo.splice(this.state.index, 1);

                this.setState({
                    toDoOpen: false,
                    daysWithToDo: changedToDo
                })
            } else {
                changedToDo[this.state.index].todos = todowithdiv;

                this.setState({
                    toDoOpen: false,
                    daysWithToDo: changedToDo
                })
            }
        } else {
            if (allToDos.length !== 0) {
                let changedToDo = Object.assign([], this.state.daysWithToDo);
                changedToDo.push({
                    date: new moment(this.currentYear() + "-" + moment().month(this.currentMonth()).format("MM") + "-" + this.state.currentDayNum),
                    todos: todowithdiv
                });

                //sorting
                changedToDo = this.sort(changedToDo);

                this.setState({
                    toDoOpen: false,
                    daysWithToDo: changedToDo
                })
            } else {
                this.setState({
                    toDoOpen: false
                })
            }
        }
    }

    sort = (dateStrings) => {
        const array = dateStrings;
        const sortedArray = array.sort((a, b) => new moment(a.date).format('YYYYMMDD') - new moment(b.date).format('YYYYMMDD'))
        return sortedArray
    }

    handleEnter = id => {
        let targetted = document.getElementById(id).lastElementChild;
        targetted.setAttribute("style", "display: flex;");
    }

    handleLeave = id => {
        let targetted = document.getElementById(id).lastElementChild;
        targetted.setAttribute("style", "display: none;");
    }

    quickDelete = tobeDeleted => {

        this.setState({
            confirmDiv: true,
            index: tobeDeleted.nthObject
        })
    }

    openToDoList = () => {
        this.setState({
            todoDiv: true
        })
    }

    getRows(days, componentNum, blankdays = []) {
        var totalSlots = blankdays !== [] ? [...blankdays, ...days] : [...days];
        let itemNum = componentNum === 3 ? 4 : 7;

        let rows = [];
        let cells = [];

        totalSlots.forEach((row, i) => {
            if (i === 0) {
                cells.push(row);
            } else if (i % itemNum !== 0) {
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
            return <tr key={"days_" + i} className="days">{d}</tr>;
        });

        return daysinmonth;
    }



    doneManageAll = (finalTodo) => {
        this.setState({
            daysWithToDo: finalTodo,
            todoDiv: false
        })
    }

    confirmation = yesorno => {

        if (yesorno) {
            let changedToDo = Object.assign([], this.state.daysWithToDo)
            changedToDo.splice(this.state.index, 1);

            this.setState({
                confirmDiv: false,
                daysWithToDo: changedToDo
            })
        } else {
            this.setState({
                confirmDiv: false
            })
        }

    }

    render() {
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
            let todoInfo = {};
            let todoList = [];
            let objNum;
            let found = false;

            if (this.state.daysWithToDo.length !== 0) {
                this.state.daysWithToDo.forEach((obj, index) => {
                    let selected = new moment(this.currentYear() + "-" + moment().month(this.currentMonth()).format("MM") + "-" + d);
                    if (obj.date.isSame(selected)) {
                        found = true;
                        objNum = index;
                        todoList = obj.todos.map(todo => {
                            return todo
                        });
                        todoInfo = {
                            todoList: todoList,
                            nthObject: objNum
                        }
                    }
                    if (!found) {
                        todoInfo = {
                            todoList: todoList,
                            nthObject: -1
                        }
                    }
                })
            } else {
                todoInfo = {
                    todoList: todoList,
                    nthObject: -1
                }
            }

            if (todoList.length !== 0) {
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

        let daysinmonth = this.getRows(daysInMonth, 1, blankDays);

        return (
            <div ref={(divElement) => this.divElement = divElement}>
                {this.openSchedule()}
                <div className={this.state.confirmDiv || this.state.todoDiv || this.state.monthDiv ? "calendar-year cal-blur bg-primary" : "calendar-year bg-primary"} onClick={e => this.setYear()}>
                    <p>{this.currentYear()}</p>
                </div>

                {this.state.yearDiv && <div className="year-selection">{this.yearList()}</div>}

                <div ref={(divele) => this.divele = divele}
                    className={this.state.confirmDiv || this.state.todoDiv ? "calendar-month cal-blur" : "calendar-month"} onClick={e => this.setMonth()}>
                    <p>{this.currentMonth().toLocaleUpperCase()}</p>
                </div>

                {this.state.monthDiv && <div className="month-selection">{this.monthList()}</div>}
                {this.state.confirmDiv &&
                    <div className="confirm-container">
                        Are you sure you delete this?
                                <div className="yesorno-container">
                            <button className="yes btn-success" onClick={e => this.confirmation(true)}>Yes</button>
                            <button className="no btn-danger" onClick={e => this.confirmation(false)}>No</button>
                        </div>
                    </div>
                }
                <table className={this.state.confirmDiv || this.state.monthDiv || this.state.yearDiv || this.state.todoDiv ? "calendar cal-blur" : "calendar"}>
                    <thead>
                        <tr className="weekday cal-container">
                            {weekdayshortname}
                        </tr>
                    </thead>
                    <tbody>
                        {daysinmonth}
                    </tbody>
                </table>
                <div className={this.state.confirmDiv || this.state.todoDiv || this.state.monthDiv || this.state.yearDiv ? "all-todos cal-blur" : "all-todos"}
                    ref={(tdlist) => this.tdlist = tdlist} onClick={e => this.openToDoList()}>Check All To-Dos</div>
                {this.state.todoDiv &&
                    <ThreeBlock
                        getRows={this.getRows} sort={this.sort} top={this.styleTop} height={this.heightThree}
                        todoall={this.state.daysWithToDo} date={this.state.dateObject} twoblockheight={this.height}
                        mouseLeave={this.handleLeave} done={this.doneManageAll} />
                }
            </div>
        );
    }
}

export default OneBlock;
