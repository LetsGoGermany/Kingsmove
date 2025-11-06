const fs = require("fs")

module.exports = (app) => {
    app.post("/api/todos", async (req, res) => {
      const entry = {
        title: req.body.title,
        date: Date.now()
      }
      if(!(req.body.title.length > 0) || typeof req.body.title.length === "string") return 
      const result = await manageNewTodo(entry)
      res.send(result)
    })
    
    
    
    async function manageNewTodo(entry) {
      const currentTodos = readTodoFile()
    
    
      if(!entry.title) currentTodos
      currentTodos.push(entry)
      updateTodoList(currentTodos)
      return currentTodos
    }
    
    function readTodoFile() {
      return JSON.parse(
        fs.readFileSync('./todos/todo.json', { encoding: 'utf8'})
      )
    }
    
    function updateTodoList(currentTodos) {
      fs.promises.writeFile("./todos/todo.json",JSON.stringify(currentTodos,null,2)).catch(() => [])
    }
    
    app.delete("/api/todos", async (req, res) => {
      const currentTodos = readTodoFile()
      const toDelete = currentTodos.findIndex(el => el.date.toString() === req.body.id)
      if (toDelete < 0) return res.send(currentTodos)
      currentTodos.splice(toDelete, 1)
      updateTodoList(currentTodos)
      res.send(currentTodos)
    })
    
    app.get("/api/todos",async (req,res) => {
      const currentTodos = readTodoFile()
      res.send(currentTodos)
    })
}