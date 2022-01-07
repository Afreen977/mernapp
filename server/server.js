import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import { readdirSync } from 'fs'
import { Server } from 'socket.io'



const morgan=require('morgan')
require('dotenv').config()

const app=express()

app.use('/uploads',express.static(require("path").join(__dirname,'uploads')))
const http=require("http").createServer(app)
const io=require("socket.io")(http,{
  path:'/socket.io', //path is used explictly for socket io because frontend and backend will be deployed together in Digital Ocean
  cors:{
    origin:'*',
    methods:["GET","POST"],
    allowedHeaders:["Content-Type"]
  }
})


mongoose.connect('mongodb://localhost:27017/Merncamp',{
    useNewUrlParser:true,
    useUnifiedTopology:true,

})
.then(()=>console.log("DB connected"))
.catch((error)=>console.log("DB Connection error"+error))


app.use(express.json({limit:"5mb"}))
app.use(express.urlencoded({extended:true}))

app.use(cors({origin:'*'}))



readdirSync('./routes').map((r)=>{
  console.log("file is "+r)
  app.use('/api',require(`./routes/${r}`))
})

io.on('connect',(socket)=>{
   console.log('SOCKET>IO',socket.id)
   socket.on('new-post',(newPost)=>{
     //console.log('new message recived',newPost)
     socket.broadcast.emit('new-post',newPost)
   })
   
})
http.listen(process.env.PORT,()=>{
    console.log(`Server running on port ${process.env.port}`)
})