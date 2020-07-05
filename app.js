const express = require('express')
const cors = require('cors')
const postRoutes = require('./routes/posts')
const userRoutes = require('./routes/user')
const app = express()
require('./db/mongoose')

app.use(cors())
app.use(express.json())
app.use('/images', express.static(__dirname+"/images"))


app.use('/api/posts', postRoutes)
app.use('/api/user', userRoutes)

const port = process.env.PORT || 3000
app.listen(port, ()=> {
    console.log("server has been started")
})