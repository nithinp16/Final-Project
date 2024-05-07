const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const cookieParser=require('cookie-parser')
const authRoutes=require('./routes/authRoutes')
const budgetRoutes=require('./routes/budgetRoutes')
const expenseRoutes=require('./routes/expenseRoutes')
const generalRoutes=require('./routes/generalRoutes')


const port=3000


const app=express()

app.use(cors({
    origin:['http://localhost:4200'],
    credentials:true
}))

app.use(cookieParser())
app.use(express.json())

app.use("/",authRoutes)
app.use("/categories",generalRoutes)
app.use("/budget",budgetRoutes)
app.use("/expense",expenseRoutes)


app.use(function(req, res, next) {
    res.status(err.status || 404).json({
      message: "No such route exists"
    })
  });
  app.use(function(err, req, res, next) {
    res.status(err.status || 500).json({
      message: err.message
    })
  });
mongoose.connect("mongodb://localhost:27017/b-t",{
    useNewUrlParser:true,
})
.then(()=>{
    console.log("connected to database")

    app.listen(port,()=>{
        console.log(`API listening to http://localhost:${port}`)
    })
})