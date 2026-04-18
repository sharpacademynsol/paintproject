(function () {
	"use strict";

	window.onload = function () {

		// Header Sticky
		const getHeaderId = document.getElementById("navbar");
		if (getHeaderId) {
			window.addEventListener('scroll', event => {
				const height = 200;
				const { scrollTop } = event.target.scrollingElement;
				document.querySelector('#navbar').classList.toggle('sticky', scrollTop >= height);
			});
		}

		// Back to Top JS
		const getId = document.getElementById("backtotop");
		if (getId) {
			const topbutton = document.getElementById("backtotop");
			topbutton.onclick = function (e) {
				window.scrollTo({ top: 0, behavior: "smooth" });
			};
			window.onscroll = function () {
				if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
					topbutton.style.opacity = "1";
				} else {
					topbutton.style.opacity = "0";
				}
			};
		}

		// Preloader JS
		const getPreloaderId = document.getElementById('preloader');
		if (getPreloaderId) {
			getPreloaderId.style.display = 'none';
		}
	};

	// Services Slide JS
	var swiper = new Swiper(".services-slide", {
		slidesPerView: 1,
		spaceBetween: 30,
		centeredSlides: false,
		preventClicks: true,
		loop: false,
		autoHeight: true,
		autoplay: {
			delay: 5000,
			disableOnInteraction: false,
			pauseOnMouseEnter: true,
		},
		pagination: {
			clickable: true,
			el: ".swiper-pagination-services",
		},
		breakpoints: {
			0: {
				slidesPerView: 1,
			},
			768: {
				slidesPerView: 2,
			},
			992: {
				slidesPerView: 2.9,
			},
			1200: {
				slidesPerView: 3,
			},
			1600: {
				slidesPerView: 3,
			},
		}
	});

	// Testimonial Slide JS
	var swiper = new Swiper(".testimonial-slide", {
		slidesPerView: 1,
		spaceBetween: 0,
		centeredSlides: false,
		preventClicks: true,
		loop: false,
		autoHeight: true,
		autoplay: {
			delay: 5000,
			disableOnInteraction: false,
			pauseOnMouseEnter: true,
		},
		pagination: {
			el: ".swiper-pagination-testimonial",
			clickable: true,
		},
		navigation: {
			prevEl: ".next2",
			nextEl: ".prev2",
		},
	});

	// Projects Slide JS
	var swiper = new Swiper(".projects-slide", {
		slidesPerView: 1,
		spaceBetween: 30,
		centeredSlides: true,
		preventClicks: true,
		loop: true,
		autoHeight: true,
		autoplay: {
			delay: 5000,
			disableOnInteraction: false,
			pauseOnMouseEnter: true,
		},
		pagination: {
			clickable: true,
		},
		navigation: {
			prevEl: ".next1",
			nextEl: ".prev1",
		},
		breakpoints: {
			0: {
				slidesPerView: 1,
			},
			768: {
				slidesPerView: 2,
			},
			992: {
				slidesPerView: 2.5,
			},
			1200: {
				slidesPerView: 3,
			},
			1600: {
				slidesPerView: 3,
			},
		}
	});

	// Projects Slide JS
	var swiper = new Swiper(".projects-slide-two", {
		slidesPerView: 1,
		spaceBetween: 30,
		centeredSlides: true,
		preventClicks: true,
		loop: true,
		autoHeight: true,
		effect: "coverflow",
		autoplay: {
			delay: 5000000,
			disableOnInteraction: false,
			pauseOnMouseEnter: true,
		},
		pagination: {
			el: ".swiper-pagination-projects-two",
			clickable: true,
		},
		navigation: {
			prevEl: ".next1",
			nextEl: ".prev1",
		},
		breakpoints: {
			0: {
				slidesPerView: 1,
			},
			768: {
				slidesPerView: 2,
			},
			992: {
				slidesPerView: 2.5,
			},
			1200: {
				slidesPerView: 3,
			},
			1600: {
				slidesPerView: 3,
			},
		}
	});

	// Team Slide JS
	var swiper = new Swiper(".team-slide", {
		slidesPerView: 1,
		spaceBetween: 30,
		centeredSlides: false,
		preventClicks: true,
		loop: false,
		autoHeight: true,
		autoplay: {
			delay: 5000,
			disableOnInteraction: false,
			pauseOnMouseEnter: true,
		},
		pagination: {
			el: ".swiper-pagination-team",
			clickable: true,
		},
		breakpoints: {
			0: {
				slidesPerView: 1,
			},
			768: {
				slidesPerView: 2,
			},
			992: {
				slidesPerView: 2.5,
			},
			1200: {
				slidesPerView: 3,
			},
			1600: {
				slidesPerView: 4,
			},
		}
	});

	// Partner Slide JS
	var swiper = new Swiper(".partner-slide", {
		slidesPerView: 1,
		spaceBetween: 30,
		centeredSlides: false,
		preventClicks: true,
		loop: false,
		autoHeight: true,
		autoplay: {
			delay: 5000,
			disableOnInteraction: false,
			pauseOnMouseEnter: true,
		},
		breakpoints: {
			0: {
				slidesPerView: 1,
			},
			485: {
				slidesPerView: 2,
			},
			768: {
				slidesPerView: 3,
			},
			992: {
				slidesPerView: 4,
			},
			1200: {
				slidesPerView: 5,
			},
			1600: {
				slidesPerView: 6,
			},
		}
	});

	// Products Slide JS
	var swiper = new Swiper(".products-slide", {
		slidesPerView: 1,
		spaceBetween: 30,
		centeredSlides: false,
		preventClicks: true,
		loop: false,
		autoHeight: true,
		autoplay: {
			delay: 5000,
			disableOnInteraction: false,
			pauseOnMouseEnter: true,
		},
		pagination: {
			el: ".swiper-pagination-products",
			clickable: true,
		},
		breakpoints: {
			0: {
				slidesPerView: 1,
			},
			768: {
				slidesPerView: 2,
			},
			992: {
				slidesPerView: 2.5,
			},
			1200: {
				slidesPerView: 3,
			},
			1600: {
				slidesPerView: 4,
			},
		}
	});

	// Before After JS
	const getBeforeAfterId = document.getElementById('before_after');
	if (getBeforeAfterId) {
		const container = document.querySelector(".ba-container");
		const after = document.getElementById("after-img");
		const handle = document.getElementById("ba-handle");

		let isDragging = false;

		handle.addEventListener("mousedown", () => {
			isDragging = true;
		});

		window.addEventListener("mouseup", () => {
			isDragging = false;
		});

		window.addEventListener("mousemove", function (e) {
			if (!isDragging) return;

			let rect = container.getBoundingClientRect();
			let x = e.clientX - rect.left;

			if (x < 0) x = 0;
			if (x > rect.width) x = rect.width;

			let percent = (x / rect.width) * 100;

			after.style.width = percent + "%";
			handle.style.left = percent + "%";
		});
	}

	// Odometer JS
	const counters = document.querySelectorAll('.counter');
	const speed = 200;
	const io = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				const counter = entry.target;
				let target = parseInt(counter.innerText, 10); // FIXED

				let count = 0;
				const interval = setInterval(() => {
					count++;
					counter.innerText = count;

					if (parseInt(counter.innerText, 10) >= target) { // FIXED
						clearInterval(interval);
					}
				}, speed);
			}
		});
	});
	counters.forEach(counter => io.observe(counter));

	// Ukiyo.js
	const parallax = new Ukiyo('.ukiyo', {
		externalRAF: true,
	});

	// Force body height = auto
	document.body.style.height = "auto";
	document.documentElement.style.height = "auto";

	//smooth scroll
	const lenis = new Lenis({
		duration: 0.75,
		smoothWheel: true,
		smoothTouch: false,
	});

	// animate
	function raf(time) {
		parallax.animate();

		lenis.raf(time);
		requestAnimationFrame(raf);
	}
	requestAnimationFrame(raf);

	// ScrollCue JS
	scrollCue.init();

	// Quantity Buttons
	const quantityWrappers = document.querySelectorAll('.item-quantity');
	quantityWrappers.forEach(wrapper => {
		const input = wrapper.querySelector('.quantity-input');
		const buttons = wrapper.querySelectorAll('.quantity-btn');

		const downBtn = wrapper.querySelector('.down-arrow');
		const upBtn = wrapper.querySelector('.up-arrow');

		// Increase
		upBtn.closest(".quantity-btn").addEventListener("click", () => {
			let value = parseInt(input.value, 10); // FIXED
			input.value = value + 1;
		});

		// Decrease
		downBtn.closest(".quantity-btn").addEventListener("click", () => {
			let value = parseInt(input.value, 10); // FIXED
			if (value > 1) {
				input.value = value - 1;
			}
		});
	});

	// Review Rating
	const ratings = document.querySelectorAll('.rating');
	ratings.forEach(rating => {
		rating.addEventListener('click', () => {
			// reset all ratings to default state
			ratings.forEach(rating => {
				rating.classList.remove('active');
			});

			// add active class to clicked rating and all previous ratings
			rating.classList.add('active');
			let prevRating = rating.previousElementSibling;
			while (prevRating) {
				prevRating.classList.add('active');
				prevRating = prevRating.previousElementSibling;
			}
		});
	});

	// Payment Method JS
	const getPaymentMethodId = document.getElementById('payment_method');
	if (getPaymentMethodId) {
		document.querySelectorAll('.payment-option input[type="radio"]').forEach(radio => {
			radio.addEventListener('change', () => {
				document.querySelectorAll('.payment-option').forEach(option => {
					option.classList.remove('active');
				});
				radio.closest('.payment-option').classList.add('active');
			});
		});
	}

	// Login Coupon JS
	const getLoginCouponId = document.getElementById('login_coupon');
	if (getLoginCouponId){
		document.querySelectorAll('.login-coupon-option input[type="radio"]').forEach(radio => {
			radio.addEventListener('change', () => {
				document.querySelectorAll('.login-coupon-option').forEach(option => {
					option.classList.remove('active');
				});
				radio.closest('.login-coupon-option').classList.add('active');
			});
		});
	}

	// Close modal if click is outside the input
	const getCloseModalId = document.getElementById("staticBackdrop");
	if (getCloseModalId) {
		document.addEventListener("click", function (e) {
			const modal = document.querySelector("#staticBackdrop");
			const input = document.querySelector("#searchInput");

			if (modal.classList.contains("show")) {
				// if click is inside input → do nothing
				if (input.contains(e.target)) return;

				// if click is inside modal-content → prevent closing only for input
				if (modal.querySelector(".modal-content").contains(e.target) && !input.contains(e.target)) {
					bootstrap.Modal.getInstance(modal).hide();
				}
			}
		});
	}
	
	// // Only For Light & Dark
	// const toggleButton = document.getElementById('for-light-dark');
	// if (toggleButton) {
	// 	const savedMode = localStorage.getItem('for_mode');

	// 	// Apply saved mode on load
	// 	if (savedMode) {
	// 		document.body.setAttribute('for-dark-light-data-mode', savedMode);
	// 		toggleButton.textContent =
	// 			savedMode === 'for-dark' ? 'Switch To Light' : 'Switch To Dark';
	// 	} else {
	// 		document.body.setAttribute('for-dark-light-data-mode', 'for-light');
	// 		toggleButton.textContent = 'Switch To Dark';
	// 	}

	// 	// Add event listener
	// 	toggleButton.addEventListener('click', () => {
	// 		const currentMode = document.body.getAttribute('for-dark-light-data-mode');
	// 		const newMode = currentMode === 'for-dark' ? 'for-light' : 'for-dark';

	// 		document.body.setAttribute('for-dark-light-data-mode', newMode);
	// 		localStorage.setItem('for_mode', newMode);

	// 		toggleButton.textContent =
	// 			newMode === 'for-dark' ? 'Switch To Light' : 'Switch To Dark';
	// 	});
	// }

	// // Only For RTL & LTR
	// try {
	// 	function setMode(modeName) {
	// 		localStorage.setItem('for_rtl', modeName);
	// 		document.documentElement.className = modeName;

	// 		// Update button text dynamically
	// 		const btn = document.getElementById('rtlToggleBtn');
	// 		if (btn) {
	// 			btn.textContent = modeName === 'rtl' ? 'Switch To LTR' : 'Switch To RTL';
	// 		}
	// 	}

	// 	function toggleMode() {
	// 		if (localStorage.getItem('for_rtl') === 'rtl') {   // ✅ fixed strict equality
	// 			setMode('ltr');
	// 		} else {
	// 			setMode('rtl');
	// 		}
	// 	}

	// 	// Run on load
	// 	(function () {
	// 		if (localStorage.getItem('for_rtl') === 'rtl') {   // ✅ fixed strict equality
	// 			setMode('rtl');
	// 		} else {
	// 			setMode('ltr');
	// 		}

	// 		// Add event listener instead of onclick
	// 		const btn = document.getElementById('rtlToggleBtn');
	// 		if (btn) {
	// 			btn.addEventListener('click', toggleMode);
	// 		}
	// 	})();
	// } catch (e) { }

	// // Select all buttons with the class 'like-button' Favorite Button
	// document.querySelectorAll('.slide-active').forEach(button => {
	// 	// Add click event listener to each button
	// 	button.addEventListener('click', () => {
	// 		// Toggle 'liked' class
	// 		button.classList.toggle('active');
	// 	});
	// });
})();

// For Mobile Navbar JS
const list = document.querySelectorAll('.mobile-menu-list');
function accordion(e) {
	e.stopPropagation();
	if (this.classList.contains('active')) {
		this.classList.remove('active');
	}
	else if (this.parentElement.parentElement.classList.contains('active')) {
		this.classList.add('active');
	}
	else {
		for (i = 0; i < list.length; i++) {
			list[i].classList.remove('active');
		}
		this.classList.add('active');
	}
}
for (i = 0; i < list.length; i++) {
	list[i].addEventListener('click', accordion);
}