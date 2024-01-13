const init = function () {
	const imagesList = document.querySelectorAll(".gallery__item");
	imagesList.forEach((img) => {
		img.dataset.sliderGroupName = Math.random() > 0.5 ? "nice" : "good";
	}); // za każdym przeładowaniem strony przydzielaj inną nazwę grupy dla zdjęcia

	runJSSlider();
};

document.addEventListener("DOMContentLoaded", init);

const runJSSlider = function () {
	const imagesSelector = ".gallery__item";
	const sliderRootSelector = ".js-slider";

	const imagesList = document.querySelectorAll(imagesSelector);
	const sliderRootElement = document.querySelector(sliderRootSelector);

	initEvents(imagesList, sliderRootElement);
	initCustomEvents(imagesList, sliderRootElement, imagesSelector);
};

const initEvents = function (imagesList, sliderRootElement) {
	imagesList.forEach(function (item) {
		item.addEventListener("click", function (e) {
			fireCustomEvent(e.currentTarget, "js-slider-img-click");
		});
	});

	// todo:
	// utwórz nasłuchiwanie eventu o nazwie [click], który ma uruchomić event [js-slider-img-next]
	// na elemencie [.js-slider__nav--next]
	const navNext = sliderRootElement.querySelector(".js-slider__nav--next");
	navNext.addEventListener("click", function () {
		fireCustomEvent(sliderRootElement, "js-slider-img-next");
	});

	// todo:
	// utwórz nasłuchiwanie eventu o nazwie [click], który ma uruchomić event [js-slider-img-prev]
	// na elemencie [.js-slider__nav--prev]
	const navPrev = sliderRootElement.querySelector(".js-slider__nav--prev");

	navPrev.addEventListener("click", function () {
		fireCustomEvent(sliderRootElement, "js-slider-img-prev");
	});

	// todo:
	// utwórz nasłuchiwanie eventu o nazwie [click], który ma uruchomić event [js-slider-close]
	// tylko wtedy, gdy użytkownik kliknie w [.js-slider__zoom]
	const zoom = sliderRootElement.querySelector(".js-slider__zoom");
	zoom.addEventListener("click", function (event) {
		if (event.target === zoom) {
			fireCustomEvent(sliderRootElement, "js-slider-close");
		}
	});
};

const fireCustomEvent = function (element, name) {
	console.log(element.className, "=>", name);

	const event = new CustomEvent(name, {
		bubbles: true,
	});

	element.dispatchEvent(event);
};

const initCustomEvents = function (
	imagesList,
	sliderRootElement,
	imagesSelector
) {
	imagesList.forEach(function (img) {
		img.addEventListener("js-slider-img-click", function (event) {
			onImageClick(event, sliderRootElement, imagesSelector);
		});
	});

	sliderRootElement.addEventListener("js-slider-img-next", onImageNext);
	sliderRootElement.addEventListener("js-slider-img-prev", onImagePrev);
	sliderRootElement.addEventListener("js-slider-close", onClose);
};

const onImageClick = function (event, sliderRootElement, imagesSelector) {
	// todo:
	// 1. dodać klasę [.js-slider--active], aby pokazać całą sekcję

	sliderRootElement.classList.add("js-slider--active");
	// 2. wyszukać ściężkę (atrybut [src]) do klikniętego elementu i wstawić do [.js-slider__image]
	const clickedImageSrc =
		event.currentTarget.querySelector(".gallery__image").src;
	const sliderImage = sliderRootElement.querySelector(".js-slider__image");
	sliderImage.src = clickedImageSrc;
	// 3. pobrać nazwę grupy zapisaną w dataset klikniętego elementu
	const groupName = event.currentTarget.dataset.sliderGroupName;
	// 4. wyszukać wszystkie zdjęcia należące do danej grupy, które wykorzystasz do osadzenia w dolnym pasku
	const groupImages = document.querySelectorAll(
		`${imagesSelector}[data-slider-group-name="${groupName}"]`
	);
	console.log(groupImages);
	// 5. utworzyć na podstawie elementu [.js-slider__thumbs-item--prototype] zawartość dla [.js-slider__thumbs]

	const thumbsPrototype = document.querySelector(
		".js-slider__thumbs-item--prototype"
	);

	if (!thumbsPrototype) {
		console.error("Element .js-slider__thumbs-item--prototype nie znaleziono");
	} else {
		const thumbsContainer =
			sliderRootElement.querySelector(".js-slider__thumbs");
		thumbsContainer.innerHTML = ""; // Wyczyszczenie poprzedniej zawartości

		const groupImages = document.querySelectorAll(
			`${imagesSelector}[data-slider-group-name="${groupName}"]`
		);

		groupImages.forEach((groupImage, index) => {
			const thumbsItem = thumbsPrototype.cloneNode(true);
			thumbsItem.classList.remove("js-slider__thumbs-item--prototype");
			thumbsItem.querySelector(".js-slider__thumbs-image").src =
				groupImage.querySelector(".gallery__image").src;

			if (
				thumbsItem.querySelector(".js-slider__thumbs-image").src ===
				sliderImage.src
			) {
				thumbsItem
					.querySelector(".js-slider__thumbs-image")
					.classList.add("js-slider__thumbs-image--current");
			}

			thumbsContainer.appendChild(thumbsItem);
		});
	}
};

	const onImageNext = function (event, sliderRootElement) {
		// console.log(this, "onImageNext");
		// // [this] wskazuje na element [.js-slider]

		// todo:
		// 1. wyszukać aktualny wyświetlany element przy pomocy [.js-slider__thumbs-image--current]
		const thumbsContainer = this.querySelector(".js-slider__thumbs"); // miniaturki zdjęć na dole

		if (!thumbsContainer) {
			console.error("Element .js-slider__thumbs not found.");
			return;
		}

		
		// TO JEST ELEMENT IMG
		const currentThumb = thumbsContainer.querySelector(
			".js-slider__thumbs-image--current"
		);
		console.log("Current thumb:", currentThumb);

		// 2. znaleźć element następny do wyświetlenie względem drzewa DOM dla [.js-slider__thumbs]
		let nextThumb = currentThumb.parentElement.nextElementSibling;
		console.log("nextThumb:", nextThumb);
		// 3. sprawdzić czy ten element istnieje - jeśli nie to [.nextElementSibling] zwróci [null]
		if (!nextThumb) {
			console.error("następny element nie istnieje");
			return;
		}
		// 4. przełączyć klasę [.js-slider__thumbs-image--current] do odpowiedniego elementu
		currentThumb.classList.remove("js-slider__thumbs-image--current");
		console.log("currentThumb", currentThumb);
		
		nextThumb
			.querySelector("img")
			.classList.add("js-slider__thumbs-image--current");
		// 5. podmienić atrybut o nazwie [src] dla [.js-slider__image]
		const imageSrc = nextThumb.querySelector('img').src;
		console.log(imageSrc);

		const mainImage = document.querySelector(".js-slider__image");

		console.log(mainImage);
		mainImage.src = imageSrc;
		
	};

const onImagePrev = function (event) {
	console.log(this, "onImagePrev");
	// 1. wyszukać aktualny wyświetlany element przy pomocy [.js-slider__thumbs-image--current]
	const thumbsContainer = this.querySelector(".js-slider__thumbs"); // miniaturki zdjęć na dole

	if (!thumbsContainer) {
		console.error("Element .js-slider__thumbs not found.");
		return;
	}

	// TO JEST ELEMENT IMG
	const currentThumb = thumbsContainer.querySelector(
		".js-slider__thumbs-image--current"
	);

	if (!currentThumb) {
		console.error("Current thumb not found.");
		return;
	}

	// 2. znaleźć element poprzedni do wyświetlenie względem drzewa DOM dla [.js-slider__thumbs]
	let prevThumb = currentThumb.parentElement.previousElementSibling;

	// 3. sprawdzić czy ten element istnieje i czy nie posiada klasy [.js-slider__thumbs-item--prototype]
	while (
		prevThumb &&
		prevThumb.classList.contains("js-slider__thumbs-item--prototype")
	) {
		prevThumb = prevThumb.previousElementSibling; // Jeśli to jest prototyp, idź do poprzedniego elementu
	}

	// 4. przełączyć klasę [.js-slider__thumbs-image--current] do odpowiedniego elementu
	if (prevThumb) {
		currentThumb.classList.remove("js-slider__thumbs-image--current");
		prevThumb
			.querySelector("img")
			.classList.add("js-slider__thumbs-image--current");

		// 5. podmienić atrybut [src] dla [.js-slider__image]
		const imageSrc = prevThumb.querySelector("img").src;
		const mainImage = document.querySelector(".js-slider__image");
		mainImage.src = imageSrc;
	}
};

const onClose = function (event) {
	// todo:
	// 1. należy usunąć klasę [js-slider--active] dla [.js-slider]
	const sliderRootElement = document.querySelector(".js-slider");
	sliderRootElement.classList.remove("js-slider--active");

	// 2. należy usunąć wszystkie dzieci dla [.js-slider__thumbs] pomijając [.js-slider__thumbs-item--prototype]
	const thumbsContainer = sliderRootElement.querySelector(".js-slider__thumbs");

	if (!thumbsContainer) {
		console.error("Element .js-slider__thumbs not found.");
		return;
	}

	const thumbsItems = thumbsContainer.querySelectorAll(
		".js-slider__thumbs-item"
	);

	thumbsItems.forEach((item) => {
		if (!item.classList.contains("js-slider__thumbs-item--prototype")) {
			// Usuwamy dzieci, które nie są prototypem
			thumbsContainer.removeChild(item);
		}
	});
};
