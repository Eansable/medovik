import express, {Request, Response} from 'express'

const app = express()


app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => {

    res.send("message")
})

app.post("/takeOrder", (req: Request, res: Response) => {
    console.log(req.body)
    res.send(req.query)
})

app.listen(3000, () => {
    console.log("srever running")
})