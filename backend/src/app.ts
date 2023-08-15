import cors from "cors";
import express from "express"

require('dotenv').config()

const app = express()

// Middleware
app.use(express.json())
app.use(cors());

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
