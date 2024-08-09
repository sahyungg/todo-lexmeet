import React from 'react';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './custom-datepicker.css'; // Import the custom CSS
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


// Quote array
const quotes = [
    "Pleasure in the job puts perfection in the work. – Aristotle",
    "It is not the mountain we conquer, but ourselves. – Sir Edmund Hillary",
    "Lost time is never found again. – Benjamin Franklin",
    "Productivity is being able to do things that you were never able to do before. – Franz Kafka",
    "You may delay, but time will not. – Benjamin Franklin",
    "Both good and bad days should end with productivity. Your mood affairs should never influence your work. – Greg Evans",
    "Until we can manage time, we can manage nothing else. – Peter Drucker"
];



export default function TodoList() {
    const [todos, setTodos] = useState(getStoredTodos());
    const [editingIndex, setEditingIndex] = useState(null);
    const [editText, setEditText] = useState('');
    const [dueDate, setDueDate] = useState(new Date());
    const [filter, setFilter] = useState('all');
    const [alertMessage, setAlertMessage] = useState('');
    const [confirmMessage, setConfirmMessage] = useState('');
    const [confirmCallback, setConfirmCallback] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [quote, setQuote] = useState("");
    

    function getStoredTodos() {
        let data = localStorage.getItem("todos");
        try {
            let json = JSON.parse(data);
            if (Array.isArray(json)) {
                return json;
            }
        } catch (error) {
            console.error("Failed to parse todos from localStorage:", error);
        }
        return [];
    }

    useEffect(() => {
        localStorage.setItem("todos", JSON.stringify(todos));
    }, [todos]);

    useEffect(() => {
        generateRandomQuote();
    }, []);

    const generateRandomQuote = () => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setQuote(quotes[randomIndex]);
    };

    function handleSubmit(event) {
        event.preventDefault();
        let task = event.target.task.value;

        if (!task) {
            setAlertMessage("Please provide a valid task");
            setShowAlert(true);
            return;
        }

        const currentDate = new Date().toLocaleDateString();
        setTodos([...todos, { task: task, date: currentDate, dueDate: dueDate.toLocaleString(), completed: false }]);
        event.target.reset();
        setDueDate(new Date());
    }

    function changeTaskStatus(index) {
        let newTodos = [...todos];
        newTodos[index].completed = !newTodos[index].completed;
        setTodos(newTodos);
    }

    function markAllAsDone() {
        let newTodos = todos.map(todo => ({
            ...todo,
            completed: true
        }));
        setTodos(newTodos);
    }

    function markAllAsUndone() {
        let newTodos = todos.map(todo => ({
            ...todo,
            completed: false
        }));
        setTodos(newTodos);
    }
    

    function deleteTask(index) {
        setConfirmMessage("Are you sure you want to delete this task?");
        setConfirmCallback(() => () => {
            let newTodos = [...todos];
            newTodos.splice(index, 1);
            setTodos(newTodos);
        });
        setShowConfirm(true);
    }

    function deleteAllTasks() {
        setConfirmMessage("Are you sure you want to delete all tasks?");
        setConfirmCallback(() => () => {
            setTodos([]);
        });
        setShowConfirm(true);
    }

    function handleEdit(index) {
        setEditingIndex(index);
        setEditText(todos[index].task);
        setDueDate(new Date(todos[index].dueDate));
    }

    function saveEdit(index) {
        let newTodos = [...todos];
        newTodos[index].task = editText;
        newTodos[index].dueDate = dueDate.toLocaleString();
        setTodos(newTodos);
        setEditingIndex(null);
        setEditText('');
        setDueDate(new Date());
    }

    function handleEditChange(event) {
        setEditText(event.target.value);
    }

    function saveEdit(index) {
        if (!editText.trim()) {
            setAlertMessage("The task cannot be empty.");
            setShowAlert(true);
            return;
        }
    
        let newTodos = [...todos];
        newTodos[index].task = editText;
        newTodos[index].dueDate = dueDate.toLocaleString();
        setTodos(newTodos);
        setEditingIndex(null);
        setEditText('');
        setDueDate(new Date());
    }
    

    const filteredTodos = todos.filter(todo => {
        if (filter === 'all') return true;
        if (filter === 'pending') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
    });

    // Calculate progress
    const totalTasks = todos.length;
    const completedTasks = todos.filter(todo => todo.completed).length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return (
        <div style={{ background: "linear-gradient(190deg, #f9a825, #7b1fa2)", minHeight: "100vh", margin: 0, padding: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <header style={{ backgroundColor: "rgba(94, 27, 137, 0.6)", width: "100%", padding: "20px", color: "white", textAlign: "left", fontSize: "1.5rem", fontWeight: "bold" }}>
                To-do App
            </header>

            <div className="container my-5">
                <div className="row justify-content-center align-items-start">
                    <div className="col-md-6 col-lg-4 mb-4 d-flex">
                        <div className="p-4 d-flex flex-column" style={{ backgroundColor: "white", borderRadius: "10px", border: "2px solid #F4512C", width: '100%', minHeight: '250px' }}>
                            <h2 className="text-left mb-3" style={{ color: '#F4512C', fontWeight: "bold" }}>Input Task</h2>

                            <form className="d-flex flex-column mb-3" onSubmit={handleSubmit}>
                                <input className="form-control me-2 mb-2" placeholder="Add an item" name="task" style={{ border: "1px solid #D3D3D3", color: "grey", width: '100%' }} />
                                <DatePicker
                                    selected={dueDate}
                                    onChange={(date) => setDueDate(date)}
                                    className="custom-datepicker-input form-control mb-2"
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    dateFormat="MM/dd/yyyy h:mm aa"
                                    timeCaption="Time"
                                    minDate={new Date()} // Restrict to today or future dates
                                />


                                <button className="btn btn-primary" type="submit" style={{ background: "#5E1B89", border: "#F4512C" }}>
                                    Add
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="col-md-6 col-lg-8 mb-4 d-flex">
                        <div className="p-4 d-flex flex-column justify-content-center align-items-center" style={{ background: "linear-gradient(270deg, rgb(84, 13, 110) 11.2%, rgb(238, 66, 102) 100.2%)", borderRadius: "10px", border: "2px solid #F4512C", textAlign: "center", width: '100%', minHeight: '250px' }}>
                            <h4 style={{ color: 'white', fontStyle: "italic" }}>
                                "{quote}"
                            </h4>
                            <button className="btn btn-link mt-2" onClick={generateRandomQuote} style={{ textDecoration: "none", color: "white", fontSize: "1rem" }}>
                                Show another quote
                            </button>
                        </div>
                    </div>
                </div>

                <div className="row justify-content-between align-items-start mt-4">
                    <div className="col-md-6 col-lg-8 mb-4">
                        <div className="p-4" style={{ backgroundColor: "white", borderRadius: "10px", border: "2px solid #F4512C", position: 'relative' }}>
                            <div
                                className="d-flex justify-content-end mb-2"
                                style={{ position: "absolute", top: "10px", right: "10px" }}
                            >
                                <button
                                    className="btn btn-outline-dark me-1"
                                    onClick={markAllAsDone}
                                    style={{
                                        backgroundColor: "#fff",
                                        color: "#5E1B89",
                                        borderColor: "#5E1B89",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = "#5E1B89";
                                        e.target.style.color = "#fff";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = "#fff";
                                        e.target.style.color = "#5E1B89";
                                    }}
                                >
                                    Mark All Done
                                </button>

                                <button
                                    className="btn btn-outline-dark me-1"
                                    onClick={markAllAsUndone} // Call the new function
                                    style={{
                                        backgroundColor: "#fff",
                                        color: "#5E1B89",
                                        borderColor: "#5E1B89",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = "#5E1B89";
                                        e.target.style.color = "#fff";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = "#fff";
                                        e.target.style.color = "#5E1B89";
                                    }}
                                >
                                    Mark All Undone
                                </button>

                                <button
                                    className="btn ms-1"
                                    onClick={deleteAllTasks}
                                    style={{
                                        backgroundColor: "#F4512C",
                                        color: "#fff",
                                        border: "none",
                                    }}
                                >
                                    <i className="bi bi-trash"></i> Clear List
                                </button>
                            </div>

                            <div className="mb-3" role="group" style={{ display: "flex", gap: "10px" }}>
                                <span 
                                    onClick={() => setFilter('all')} 
                                    style={{ 
                                        cursor: 'pointer', 
                                        color: filter === 'all' ? '#F4512C' : '#5E1B89', 
                                        textDecoration: filter === 'all' ? 'underline' : 'none', 
                                        textUnderlineOffset: filter === 'all' ? '4px' : '0', 
                                        fontWeight: filter === 'all' ? 'bold' : 'normal' 
                                    }}
                                >
                                    All
                                </span>
                                <span 
                                    onClick={() => setFilter('pending')} 
                                    style={{ 
                                        cursor: 'pointer', 
                                        color: filter === 'pending' ? '#F4512C' : '#5E1B89', 
                                        textDecoration: filter === 'pending' ? 'underline' : 'none', 
                                        textUnderlineOffset: filter === 'pending' ? '4px' : '0', 
                                        fontWeight: filter === 'pending' ? 'bold' : 'normal' 
                                    }}
                                >
                                    Pending
                                </span>
                                <span 
                                    onClick={() => setFilter('completed')} 
                                    style={{ 
                                        cursor: 'pointer', 
                                        color: filter === 'completed' ? '#F4512C' : '#5E1B89', 
                                        textDecoration: filter === 'completed' ? 'underline' : 'none', 
                                        textUnderlineOffset: filter === 'completed' ? '4px' : '0', 
                                        fontWeight: filter === 'completed' ? 'bold' : 'normal' 
                                    }}
                                >
                                    Completed
                                </span>
                            </div>

                            <ul className="list-group">
                                {filteredTodos.map((todo, index) => (
                                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center mb-2" style={{ backgroundColor: "white", border: "1px solid lightgrey" }}>
                                        {editingIndex === index ? (
                                            <>
                                                <input type="text" className="form-control me-2" value={editText} onChange={handleEditChange} />
                                                <DatePicker
                                                    selected={dueDate}
                                                    onChange={(date) => setDueDate(date)}
                                                    className="form-control me-2"
                                                    showTimeSelect
                                                    timeFormat="HH:mm"
                                                    timeIntervals={15}
                                                    dateFormat="MM/dd/yyyy h:mm aa"
                                                    timeCaption="Time"
                                                />
                                                <button className="btn btn-outline-success me-2" onClick={() => saveEdit(index)} style={{ color: "#5E1B89", borderColor: "#5E1B89" }}>
                                                    <i className="bi bi-save"></i>
                                                </button>
                                                <button className="btn btn-outline-danger" onClick={() => setEditingIndex(null)}>
                                                    <i className="bi bi-x-circle"></i>
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <div className="d-flex flex-column">
                                                    <span style={{ textDecoration: todo.completed ? 'line-through' : 'none', fontSize: "1.2rem", color: "#5E1B89" }}>{todo.task}</span>
                                                    {/* <small className="text-muted">Created: {todo.date}</small> */}
                                                    <small className="text-muted">Due: {todo.dueDate}</small>
                                                </div>
                                                <div className="d-flex">
                                                    <button className="btn me-2" onClick={() => changeTaskStatus(index)} style={{ backgroundColor: todo.completed ? '#fff' : 'transparent', color: '#5E1B89', borderColor: '#5E1B89' }}>
                                                        <i className={`bi ${todo.completed ? 'bi-arrow-counterclockwise' : 'bi-check-circle'}`}></i>
                                                    </button>
                                                    <button className="btn me-2" onClick={() => handleEdit(index)} style={{ color: '#F4512C', borderColor: '#F4512C' }}>
                                                        <i className="bi bi-pencil"></i>
                                                    </button>
                                                    <button className="btn btn-outline-danger" onClick={() => deleteTask(index)}>
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </li>
                                ))}
                            </ul>


                        </div>
                    </div>

                    <div className="col-md-6 col-lg-4 mb-4 d-flex">
                        <div className="p-4" style={{ backgroundColor: "white", borderRadius: "10px", border: "2px solid #F4512C", width: '100%', textAlign: "center" }}>
                            <h4 className="mb-3" style={{ color: '#5E1B89', fontWeight: "bold" }}>Progress</h4>
                            <div style={{ width: '50%', margin: '0 auto' }}>
                                <CircularProgressbar
                                    value={progress}
                                    text={`${Math.round(progress)}%`}
                                    styles={buildStyles({
                                        textSize: '16px',
                                        pathColor: '#FF4500',
                                        textColor: '#5E1B89',
                                        trailColor: '#D3D3D3'
                                    })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showAlert && (
            <div className="modal show" style={{ display: "block" }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header" style={{ 
                            background: 'linear-gradient(90deg, #5E1B89, #F4512C)', 
                            color: 'white' 
                        }}>
                            <h5 className="modal-title">Alert</h5>
                            <button type="button" className="btn-close" onClick={() => setShowAlert(false)}></button>
                        </div>
                        <div className="modal-body">
                            <p>{alertMessage}</p>
                        </div>
                        <div className="modal-footer">
                            <button 
                                type="button" 
                                className="btn btn-primary" 
                                onClick={() => setShowAlert(false)} 
                                style={{ 
                                    backgroundColor: '#5E1B89', 
                                    borderColor: '#5E1B89' 
                                }}
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}


            {showConfirm && (
                <div className="modal show" style={{ display: "block" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div
                                className="modal-header"
                                style={{
                                    background: "linear-gradient(90deg, #5E1B89, #F4512C)",
                                    color: "white",
                                    borderBottom: "1px solid #ddd"
                                }}
                            >
                                <h5 className="modal-title">Confirm</h5>
                                <button type="button" className="btn-close" onClick={() => setShowConfirm(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>{confirmMessage}</p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => setShowConfirm(false)}
                                    style={{
                                        color: "#5E1B89",
                                        borderColor: "#5E1B89",
                                        backgroundColor: "transparent",
                                        transition: "all 0.3s ease"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = "#5E1B89";
                                        e.target.style.color = "white";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = "transparent";
                                        e.target.style.color = "#5E1B89";
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => {
                                        if (confirmCallback) confirmCallback();
                                        setShowConfirm(false);
                                    }}
                                    style={{
                                        backgroundColor: "#F4512C",
                                        color: "white",
                                        borderColor: "#F4512C",
                                        transition: "all 0.3s ease"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = "#F4512C";
                                        e.target.style.color = "white";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = "#F4512C";
                                        e.target.style.color = "white";
                                    }}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            )}
        </div>
    );
}
