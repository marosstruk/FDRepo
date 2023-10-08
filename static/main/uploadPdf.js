/************** FILE DROP - Start **************/

document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
	const dropZoneElement = inputElement.closest(".drop-zone");
	const formElement = inputElement.closest("form");
	const submitButton = formElement.querySelector('button[type="submit"]');

	dropZoneElement.addEventListener("click", (e) => {
		inputElement.click();
	});

	inputElement.addEventListener("change", (e) => {
		if (inputElement.files.length) {
			updateThumbnail(dropZoneElement, inputElement.files);
			submitButton.disabled = false;
		} else {
			submitButton.disabled = true;
		}
	});

	formElement.addEventListener("reset", (e) => {
		dropZoneElement.classList.remove("drop-zone--over");
		const thumbnail = dropZoneElement.querySelector(".drop-zone__thumb");

		if (thumbnail) {
			thumbnail.remove();
			let promptElement = document.createElement("span");
			promptElement.classList.add("drop-zone__prompt");
			promptElement.innerHTML = "Drop file(s) here or click to upload";
			dropZoneElement.appendChild(promptElement);
		}
		submitButton.disabled = true;
	});

	dropZoneElement.addEventListener("dragover", (e) => {
		e.preventDefault();
		dropZoneElement.classList.add("drop-zone--over");
	});

	["dragleave", "dragend"].forEach((type) => {
		dropZoneElement.addEventListener(type, (e) => {
			dropZoneElement.classList.remove("drop-zone--over");
		});
	});

	dropZoneElement.addEventListener("drop", (e) => {
		e.preventDefault();

		if (e.dataTransfer.files.length) {
			inputElement.files = e.dataTransfer.files;
			updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
		}

		dropZoneElement.classList.remove("drop-zone--over");
	});
});

/**
 * Updates the thumbnail on a drop zone element.
 *
 * @param {HTMLElement} dropZoneElement
 * @param {FileList} files
 */
function updateThumbnail(dropZoneElement, files) {
	let thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb");

	// First time - remove the prompt
	if (dropZoneElement.querySelector(".drop-zone__prompt")) {
		dropZoneElement.querySelector(".drop-zone__prompt").remove();
	}

	// First time - there is no thumbnail element, so let's create it
	if (!thumbnailElement) {
		thumbnailElement = document.createElement("div");
		thumbnailElement.classList.add("drop-zone__thumb");
		dropZoneElement.appendChild(thumbnailElement);
	}

    Array.from(files).forEach(file => {
        filenameElement = document.createElement("p");
        filenameElement.innerHTML = file.name;
        thumbnailElement.appendChild(filenameElement);
    });

	// thumbnailElement.dataset.label = file.name;

	// // Show thumbnail for image files
	// if (file.type.startsWith("image/")) {
	// 	const reader = new FileReader();

	// 	reader.readAsDataURL(file);
	// 	reader.onload = () => {
	// 		thumbnailElement.style.backgroundImage = `url('${reader.result}')`;
	// 	};
	// } else {
	// 	thumbnailElement.style.backgroundImage = null;
	// }
}

/************** FILE DROP - End **************/