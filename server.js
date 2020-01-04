const express = require('express');
const app = express();
const fs = require('fs');
const cors = require('cors')

const PORT = 3212;
const FILE = './feedbacks.json';

async function writeToFile(body) {
    const comments = await readFromFile();
    comments.push(body);
    const error = fs.writeFileSync(FILE, JSON.stringify(comments));
    return error;
}

async function readFromFile() {
    const rawdata = await fs.readFileSync(FILE);
    const comments = JSON.parse(rawdata);

    return comments;
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.options('*', cors())
app.use(cors())

app.post('/feedbacks', async function(req, res) {
    await writeToFile(req.body);
        res.json({
            success: true,
            body: req.body
        });
});

app.get('/feedbacks', async function(req, res) {
    res.json({
        success: true,
        body: await readFromFile()
    });
});

app.listen(PORT, () => console.log(`Server app listening on port ${PORT}!`));