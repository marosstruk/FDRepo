/************** CHAT BOX - Start **************/

document.querySelector(".chatbubble").addEventListener("click", (e) => {
	const chatContainer = document.querySelector(".chat-container");

	if (chatContainer.style.display === "none") {
		chatContainer.style.display = "block";
		updateChatMaxHeight();
	} else {
		chatContainer.style.display = "none";
	}
});

document.querySelector("#chatTextArea").addEventListener("keypress", (e) => {
	if (e.key === "Enter") {
		e.preventDefault();

		textAreaElem = e.target
		userInput = textAreaElem.value;
		textAreaElem.value = "";

		const chatMsgsContainer = document.querySelector(".chat-container .card-body");
		// Prevent the chat box expanding when adding a new message
		chatMsgsContainer.style.maxHeight = `${chatMsgsContainer.offsetHeight}px`;
		
		displayChatResponse(chatMsgsContainer, userInput, "user");
		chatMsgsContainer.scrollTop = chatMsgsContainer.scrollHeight;

		displayThreeDots(chatMsgsContainer);

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
		});

		// Allow the chat box to expand again to support resize
		chatMsgsContainer.style.maxHeight = "";
	}
});

function updateChatMaxHeight() {
	// const chatContainer = document.querySelector(".chat-container");
	// const chatContainerHeader = document.querySelector(".chat-container .card-header");
	// const chatContainerBody = document.querySelector(".chat-container .card-body");
	// const chatContainerFooter = document.querySelector(".chat-container .card-footer");

	// const bodyMaxHeight = chatContainer.offsetHeight - chatContainerHeader.offsetHeight - chatContainerFooter.offsetHeight + 1;
	// chatContainerBody.style.maxHeight = `${bodyMaxHeight}px`;

	document.querySelector(".chat-container .card-body").style.maxHeight = "";
}


function displayThreeDots(chatMsgsContainer) {
	let replyingElem = document.createElement("div");
	replyingElem.classList.add("d-flex", "flex-row", "justify-content-start", "mb-4");
	replyingElem.innerHTML = `
		<div class="p-3 me-3 border" style="border-radius: 15px; background-color: rgba(57, 192, 237,.2);">
			<div class="dot-typing"></div>
		</div>`;
	chatMsgsContainer.appendChild(replyingElem);
};

function displayChatResponse(chatMsgsContainer, response, from) {
	let messageElem = document.createElement("div");
	let justification = "";
	let backgroundColor = "";

	if (from === "user") {
		justification = "justify-content-end";
		backgroundColor = "#fbfbfb";
	} else {
		justification = "justify-content-start";
		backgroundColor = "rgba(57, 192, 237,.2)";
	}

	messageElem.classList.add("d-flex", "flex-row", justification, "mb-4");
	messageElem.innerHTML = `
		<div class="p-3 me-3 border" style="border-radius: 15px; background-color: ${backgroundColor};">
			<p class="small mb-0">${response}</p>
		</div>`;

	chatMsgsContainer.appendChild(messageElem);
};

/************** CHAT BOX - End **************/


// $(onChatResize);

// $(document).ready(function () {
//     $('.chat-input button').click(function () {
//         var message = $('.chat-input input').val();
//         if (message.trim() !== '') {
//             $.ajax({
//                 type: 'POST',
//                 url: '/chat/',  // Update with your Django URL
//                 data: {
//                     'message': message,
//                     'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val(),
//                 },
//                 success: function (data) {
//                     var responseMessage = data.response;
//                     var newMessage = '<div class="message">' + responseMessage + '</div>';
                    
//                     // Append new message and animate
//                     $('.chat-messages').append(newMessage);
//                     animateChatScroll();
                    
//                     $('.chat-input input').val('');
//                 },
//                 error: function (xhr, errmsg, err) {
//                     console.log(errmsg);
//                 }
//             });
//         }
//     });

//     // Function to animate chat scroll
//     function animateChatScroll() {
//         $('.chat-messages').animate({ scrollTop: $('.chat-messages')[0].scrollHeight }, 500);
//     }
// });





// function uploadFile() {
// 	const uploadForm = document.getElementById('upload-form')
// 	const input = document.getElementById('upload-form__input')
//
// 	const alertBox = document.getElementById('alert-box')
// 	const imageBox = document.getElementById('image-box')
// 	const progressBox = document.getElementById('progress-bar')
// 	const cancelBox = document.getElementById('cancel-box')
// 	const cancelBtn = document.getElementById('cancel-btn')
//
// 	const csrf = document.getElementsByName('csrfmiddlewaretoken')
//
// 	input.addEventListener("change", () => {
// 		const file_data = input.files[0]
//
// 		const fd = new FormData()
// 		fd.append("crsfmiddlewaretoken", crsf[0].value)
// 		fd.append("application", file_data)
//
// 		$.ajax({
// 			type: "POST",
// 			url: uploadForm.action,
// 			enctype: "multipart/form-data",
// 			data: fd,
// 			beforeSend: function () {},
// 			xhr: function () {
// 				const xhr = new window.XMLHttpRequest()
// 				xhr.upload.addEventListener("progress", e => {
// 					console.log(e)
// 				})
// 				return xhr
// 			},
// 			success: function (response) {
// 				console.log(response)
// 			},
// 			error: function (error) {
// 				console.log(error)
// 			},
// 			cache: false,
// 			contentType: false,
// 			processData: false
// 		})
// 	})
// }


// const accordion = document.getElementsByClassName("accordion-item");
// console.log(accordion);

// for (i = 0; i < accordion.length; i++) {
// 	accordion[i].addEventListener("click", function () {
// 		let contentElem = this.querySelector(".accordion-item-body");
// 		contentElem.classList.toggle("active");
// 	});
// };


/************** ACCORDION - Start **************/

const accordionHeaders = document.querySelectorAll(".accordion-item-header");

accordionHeaders.forEach((accordionHeader) => {

	accordionHeader.addEventListener("click", function () {

		let contentElem = this.parentElement.querySelector(".accordion-item-body");
		if (!contentElem.style.height || contentElem.style.height == "0px") {
			contentElem.style.height = contentElem.scrollHeight + "px";
		} else {
			contentElem.style.height = "0px";
		}
		
		this.classList.toggle("expand");

		let noElementExpanded = !Array.from(accordionHeaders)
			.filter(headerElem => headerElem !== this)
			.some(headerElem => headerElem.classList.contains("expand"))
		if (noElementExpanded) {
			accordionHeaders.forEach(headerElem => {
				headerElem.classList.toggle("shrink");
				headerElem.parentElement.classList.toggle("mg-btm-05");
			});
		}
	});
});


document.querySelectorAll(".copy-to-clipboard").forEach(copyButton => {
	copyButton.addEventListener("click", function () {
		let textToCopy = this.parentElement.querySelector(".text-to-copy").textContent;
		navigator.clipboard.writeText(textToCopy);
		alert("Copied!");
	});
});

/************** ACCORDION - End **************/