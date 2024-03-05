// using nodemon so that you do not need to type node index.js every time new code saved

// import express - is for building the Rest apis
import express from 'express';

// import cors - provides Express middleware to enable CORS with various options, connect frontend
import cors from "cors";

// import path
import path from "path";

// import routes
import router from "./src/routes/routes.js";

// init express
const app = express();

// use path
const __dirname = path.resolve();

// use express json
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

//use cors
app.use(cors());

// use router
app.use(router);

app.get('/apis', (req, res) => {
    res.set('Content-Type', 'text/html');
    res.status(200).send("<p>Welcome to Quang's APIs</p>");
});

app.use(express.static(path.join(__dirname, './entropy/')));
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './entropy/index.html'))
});

app.use(function (req, res) {
    res.status(404);

    if (req.accepts('html')) {
        res.set('Content-Type', 'text/html');
        res.status(404).send(`
            <!doctype html>
            <html lang="en">
            <head>
                <meta charset="utf-8">
                <title>Quang's Entropy Technologies Interview</title>
                <meta name="description" content="Description Goes Here">
            </head>
            <body>
                <p>Not Found! Please check your url.</p>
            </body>
            </html>
        `);
        return;
    }

    // respond with json
    if (req.accepts('json')) {
        res.json({ status: 0, message: "API not found!", data: [] });
        return;
    }

});

const PORT = process.env.PORT || 8001;
app.listen(PORT, (error) => {
    if (!error) {
        console.log(`Server is running on port ${PORT}.`);
        console.log(`Open localhost:${PORT}/`);
    }
    else
        console.log("Error occurred, server can't start", error);
});