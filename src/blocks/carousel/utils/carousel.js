/**
 * Mounts a arrowPath inside the Splide instance if enabled.
 * @param {Splide} splide
 * @param {HTMLElement} el
 */
export function mountArrowPath(splide, el) {
	const arrowPath = el.dataset.arrow;
	if (arrowPath) {
		splide.options = {
			arrowPath
		};
	}
}

/**
 * Mounts a counter UI inside the Splide instance if enabled.
 * @param {Splide} splide
 * @param {HTMLElement} el
 */
export function mountCounter(splide, el) {
	if (!splide.options.counter) return;

	const currentIndex = splide.index + 1;
	const totalSlides = splide.length;

	const counter = document.createElement('div');
	counter.className = 'splide__counter';
	counter.setAttribute('aria-live', 'polite');
	counter.setAttribute('aria-atomic', 'true');
	counter.setAttribute('aria-label', `Slide ${currentIndex} of ${totalSlides}`);

	counter.innerHTML = `
		<div class="splide__counter-current" role="presentation">${currentIndex}</div>
		<div class="splide__counter-separator" role="presentation">/</div>
		<div class="splide__counter-total" role="presentation">${totalSlides}</div>
	`;

	const controls = el.querySelector('.splide__arrows');
	if (controls) {
		controls.appendChild(counter);
	}

	splide.on('move', (newIndex) => {
		const current = counter.querySelector('.splide__counter-current');
		const total = counter.querySelector('.splide__counter-total');
		const currentPage = newIndex + 1;

		if (current) current.textContent = currentPage;
		if (total) total.textContent = splide.length;

		counter.setAttribute('aria-label', `Slide ${currentPage} of ${splide.length}`);
	});

	splide.on('destroy', () => {
		counter.remove();
	});
}

/**
 * Mounts a progress bar UI inside the Splide instance if enabled.
 * @param {Splide} splide
 * @param {HTMLElement} el
 */
export function mountProgressBar(splide, el) {
	if (!splide.options.progressBar) return;

	const progressWrapper = document.createElement('div');
	progressWrapper.className = 'splide__progress';

	const progressBar = document.createElement('div');
	progressBar.className = 'splide__progress-bar';
	progressBar.setAttribute('role', 'presentation');
	progressWrapper.appendChild(progressBar);

	const controls = el.querySelector('.splide__wrapper');
	if (controls) {
		controls.appendChild(progressWrapper);
	} else {
		el.appendChild(progressWrapper);
	}

	const updateProgress = () => {
		const end = splide.Components.Controller.getEnd() + 1;
		const rate = Math.min((splide.index + 1) / end, 1);
		progressBar.style.width = `${rate * 100}%`;
	};

	updateProgress();
	splide.on('move', updateProgress);

	splide.on('destroy', () => {
		progressWrapper.remove();
	});
}
