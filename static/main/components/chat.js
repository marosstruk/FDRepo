document.querySelector("#chatTextArea").addEventListener("keypress", (e) => {
	if (e.key === "Enter") {
		e.preventDefault();

		textAreaElem = e.target
		userInput = textAreaElem.value;
		textAreaElem.value = "";

		// const chatMsgsContainer = document.querySelector(".chat-container .card-body");
        const chatMsgsContainer = $(textAreaElem).closest(".chat").children(".chat-history")[0];
		// Prevent the chat box expanding when adding a new message
		chatMsgsContainer.style.maxHeight = `${chatMsgsContainer.offsetHeight}px`;
		
		displayChatResponse(chatMsgsContainer, userInput, "user");
		chatMsgsContainer.scrollTop = chatMsgsContainer.scrollHeight;

		// displayThreeDots(chatMsgsContainer);
        displayChatResponse(chatMsgsContainer, "...", "AI");

		fetch("http://127.0.0.1:5000/api/beta/prompt", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Origin": "*"
			},
			body: userInput
		})
		.then(response => response.text())
		.then(data => {
			chatMsgsContainer.lastChild.remove(); // Remove the 3 dots
			displayChatResponse(chatMsgsContainer, data, "AI")
		})
        .catch(error => {
            console.log(error);
        });

		// Allow the chat box to expand again to support resize
		chatMsgsContainer.style.maxHeight = "";
	}
});

function displayThreeDots(chatMsgsContainer) {
	let replyingElem = document.createElement("div");
	replyingElem.classList.add("chat-message", "response");
	replyingElem.innerHTML = `
    <div class="stage">    
        <div class="dot-typing"></div>
    </div>`;
	chatMsgsContainer.appendChild(replyingElem);
};

function displayChatResponse(chatMsgsContainer, response, from) {
	let messageElem = document.createElement("div");
	let justification = "";
	let backgroundColor = "";
    let className = "";

	if (from === "user") {
		justification = "justify-content-end";
		backgroundColor = "#fbfbfb";
        className = "user"
	} else {
		justification = "justify-content-start";
		backgroundColor = "rgba(57, 192, 237,.2)";
        className = "response"
	}

	messageElem.classList.add("chat-message", className);
	messageElem.innerHTML = `<p>${response}</p>`;

	chatMsgsContainer.appendChild(messageElem);
};