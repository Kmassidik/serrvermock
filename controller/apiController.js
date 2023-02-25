const fs = require('fs')

let dataUsers = JSON.parse(fs.readFileSync("./json/database.json","utf-8"))
let dataTodo = JSON.parse(fs.readFileSync("./json/todos.json","utf-8")) 

module.exports ={
    home: async(req,res) => {
        try {
            res.send("welcome to api MOCKTEST")
        } catch (error) {
            res.send(error)
        }
    },
    register: async(req,res) => {
        try {
            // take data username dari body
            const { username, password } = req.body
            // cek input username tidak kosong
            if (username.trim() === "") {
                res.json({ message : 'username still blank'})
                return
            }
            const validationData = await dataUsers.find(el => el.username === username)
            let id = dataUsers.length+1
            const newUser = { id, username, password }
            // cek username sudah terdaftar
            if (validationData == undefined){
                dataUsers.push(newUser)
                fs.writeFileSync('./json/database.json',JSON.stringify(dataUsers))
                res.status(200).json({ success: true})
                return
            }
            // respond ketika username sudah terdaftar
            res.status(500).json({ error: 'try another username' })
        } catch (error) {
            res.send(error)
        }
    },
    login: async(req,res) => {
        try {
            const { username, password } = req.body
            if (username.trim() === "") {
                res.json({ message : 'username still blank'})
                return
            }
            const validationData = await dataUsers.find(el => 
                el.username === username 
                && el.password === password
            )
            if (validationData) {
                res.json({ success: true })
                return
            }
            res.statue(500).json({ error: "something wrong" })
        } catch (error) {
            res.send(error)
        }
    },
    addTodo: async(req,res) => {
        try {
            const {username, todolist} = req.body
            if (username.trim() === ""){
                return res.json({ message : 'please login first'})
            }
            if (todolist.trim() === ""){
                return res.json({ message : 'please input todo list'})
            }
            const newTodo = {
                id : dataTodo.length+1,
                todo : todolist,
                completed : false,
                username : username
            }
            dataTodo.push(newTodo)
            fs.writeFileSync('./json/todos.json', JSON.stringify(dataTodo));
            res.status(200).json({ message: 'Data has been add' })
        } catch (error) {
            res.send(error)
        }
    },
    listTodo: async(req,res) => {
        try {
            const {username} = req.params
            const authen = await dataTodo.find(todo => todo.username == username)
            if (authen == undefined) {
                return res.json({ error : "data not found"})   
            }
            const todoItem = await dataTodo.filter(todo => todo.username == username)
            res.json(todoItem)
        } catch (error) {
            res.send(error)
        }
    },
    completedTodo: async(req,res) => {
        try {
            const {username,id} = req.params
            const todoItem = await dataTodo.find(todo => todo.username == username && todo.id == id)
            if (!todoItem) {
                return res.status(404).json({ error : 'data not found'});
            }
            todoItem.completed = true
            fs.writeFileSync('./json/todos.json',JSON.stringify(dataTodo))
            res.json(todoItem)
        } catch (error) {
            res.send(error)
        }
    }
}