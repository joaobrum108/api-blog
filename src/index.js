require('dotenv').config()
const express = require('express')
const router = require('./router')
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json()); 
app.use('/portalRedfox', router)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

module.exports = app
