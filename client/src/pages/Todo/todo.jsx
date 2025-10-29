import { useEffect, useState } from "react"
import Navbar from "../../components/navbar/Navbar"

export default function Todo() {
    return (
        <>
        <Navbar></Navbar>
        <TodoList />
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
         console.log(todoInput.value)
        e.preventDefault()
        fetch(`http://localhost:1887/api/todos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({title: todoInput.value})

        })

            .then((data) => data.json())
            .then((data) => setTodos(data))
            .catch((err) => console.log(err))
    }

    return (
        <form onSubmit={sendForm}>
            <TodoInputs />
            <TodoElements {...{todos}}/>
        </form>
    )
}

function TodoInputs() {
    return (
        <section>
            <input type="text" placeholder="Add new task" id="todoInput"/>
            <input type="button" value="Add" />
        </section>
    )
}


function TodoElements({todos}) {
    console.log(todos)
    return (
        <div>{todos.map(el => {
            console.log(el);
            return <ListElement key={el.date} {...el}/>
        })}</div>
    )
}

function ListElement({title,time,checked}) {
    return (
        <div>
            <p>{title}</p>
            
        </div>
    )
}

function getTodos(setTodos) {
    return fetch("/api/todos")
                 .then((res) => res.json())
                 .then((data) => setTodos(data))
                 .catch(() => [])
}
