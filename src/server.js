const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));

const http = require("http").createServer(app);
const io = require("socket.io")(http);

const messageMax = 25;

const port = process.env.PORT || 3000;

var messages = [];

app.get("/*", (request, response) => {
    response.render("chat.ejs");
});

io.on("connection", (socket) => {
    socket.emit("firstLoad", messages);

    socket.on("sendMessage", (data) => {
        messages.push(data);
        if(messages.length > messageMax) {
            messages.splice(0, messages.length - messageMax);
        }
        io.sockets.emit("displayMessages", messages);
    });
});

http.listen(port);