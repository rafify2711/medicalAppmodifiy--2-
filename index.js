import path from 'path'
import * as dotenv from 'dotenv'
dotenv.config({ path: './src/config/.env.dev' }) // استخدام مباشر أبسط

import bootstrap from "./src/app.controller.js"
import express from 'express'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

app.get("/", (req, res) => {
  res.send("Server is running!")
})

bootstrap(app, express)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
