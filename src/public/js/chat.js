const username = document.querySelector("#username");
const message = document.querySelector("#message");
const messages = document.querySelector(".messages");

const notificationSound = document.querySelector("#notification-sound");

const sendMessage = document.querySelector("#send-message");

const socket = io("http://discord-proibido-pelo-fbi.herokuapp.com/");

sendMessage.addEventListener("click", event => send());

async function send() {
    if(message.value.trim() != "" && username.value.trim() != "") {
        await socket.emit("sendMessage", { username: username.value, message: message.value });
        message.value = "";
    } else {
        alert("Preenche seu nome e mensagem.");
    }
}

message.addEventListener("keypress", event => {
    if(event.key == "Enter") {
        send();
    }
});

socket.on("firstLoad", (data) => {
    messages.innerHTML = "";
    for(var message of data) {
        messages.innerHTML += (`
        <div class="message">
            <h4 class="usernameText">${XSSaquiNãoFilhote(message.username)}</h4>
            <p class="messageText">${XSSaquiNãoFilhote(message.message)}</p>
        </div>
        `);
    } 
    messages.scroll(0, messages.scrollHeight);
});

socket.on("displayMessages", (data) => {
    messages.innerHTML = "";
    for(var message of data) {
        messages.innerHTML += (`
        <div class="message">
            <h4 class="usernameText">${XSSaquiNãoFilhote(message.username)}</h4>
            <p class="messageText">${XSSaquiNãoFilhote(message.message)}</p>
        </div>
        `);
    }
    if(!document.hasFocus()){
        console.log("Veio uma nova mensagem!");
        notificationSound.play();
    }
    messages.scroll(0, messages.scrollHeight);
});

function XSSaquiNãoFilhote(texto) {
    return texto.replace(/&/g, "&amp").replace(/</g, "&lt").replace(/>/g, "&gt");
}
