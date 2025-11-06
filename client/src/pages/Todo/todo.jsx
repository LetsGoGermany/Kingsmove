import { useEffect, useState } from "react"
import Navbar from "../../components/navbar/Navbar"
import "./Todo.css"
import { Trash } from 'lucide-react';

export default function Todo() {
    return (
        <>
            <Navbar />
            <div className="wrapper">
                <main className="main-content">
                    <TodoList />
                </main>
            </div>
        </>
    )
}

function TodoList() {
    const [todos,setTodos] = useState([])

    useEffect(() => {
            getTodos(setTodos)
    },[])

   

    function sendForm(e) {
        const todoInput = document.getElementById("todoInput")
        e.preventDefault()
        fetch(`http://localhost:1887/api/todos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({title: todoInput.value})

        })
            .then((data) => data.json())
            .then((data) => setTodos(data))
            .then(todoInput.value = "")
    }

    return (
        <>
            <TodoInputs sendForm={sendForm}/>
            <TodoElements {...{todos,setTodos}}/>
            </>
    )
}

function TodoInputs({sendForm}) {
    return (
        <form className="input-form" onSubmit={sendForm}>
            <input type="text" placeholder="Add new task" id="todoInput" name="input" className="todo-input"/>
            <input type="button" value="Add"  className="todo-submit"/>
        </form>
    )
}


function TodoElements({ todos,setTodos }) {
    return (
        <div className="todo-list">
            {todos.map(el => {
                return <ListElement key={el.date} {...el} setTodos={setTodos}/>
            })}
        </div>
    )
}

function ListElement({ title, date, setTodos}) {

    function deleteItem(el) {
        const id = el.currentTarget.parentNode.id
            fetch(`http://localhost:1887/api/todos`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({id})

        })
            .then((data) => data.json())
            .then((data) => setTodos(data))
    }

    return (
        <div className="todo-element" id={date}>
            <p className="todo-text">{title}</p>
            <span className="todo-delete" onClick={deleteItem}>
                <Trash />
            </span>
        </div>
    )
}

function getTodos(setTodos) {
    return fetch("/api/todos")
                 .then((res) => res.json())
                 .then((data) => setTodos(data))
                 .catch(() => [])
}
