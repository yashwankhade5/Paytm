import mainRouter from "./routes/index"
import cors from "cors"

import express from "express"

const app = express()
app.use(cors())
app.use(express.json())


app.use('/api/v1',mainRouter)

app.listen(3000)

