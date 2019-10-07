(function() {
	// define constructor
	this.Nav = function() {
		// gloval element references
		this.navigation = null;
		this.menuToggle = null;
		this.menu = null;
		this.setMenuFocusTrap = null;

		// define option defaults
		const defaults = {
			dataPrefix: "data-respnav",
			breakpoint: 768,
			animationDuration: 500,
			hasChildLists: true,
			childListSelector: ".navlist--child",
		};

		// create options by extending defaults with the passed in arguments
		if (arguments[0] && typeof arguments[0] === "object") {
			this.options = extendDefaults(defaults, arguments[0]);
		}
	};

	// init navigation
	Nav.prototype.init = function() {
		// find parts of menu
		this.navigation = document.querySelector(
			`[${this.options.dataPrefix}]`
		);
		this.menuToggle = document.querySelector(
			`[${this.options.dataPrefix}-trigger]`
		);
		this.menu = document.querySelector(`[${this.options.dataPrefix}-menu]`);

		console.log(this.navigation, this.menuToggle, this.menu, this.options);

		this.setMenuFocusTrap = menuFocusTrap.bind(this);

		// check size & set up check size on window resize
		this.checkSize.call(this);
		window.addEventListener(
			"resize",
			debouce(this.checkSize.bind(this), 200)
		);

		this.menuToggle.addEventListener("click", this.openClose.bind(this));
	};

	// remove hidden attribute if it's showing full menu at start
	// i.e. is bigger than tablet / set breakpoint
	Nav.prototype.checkSize = function() {
		if (window.innerWidth >= this.options.breakpoint) {
			this.menu.removeAttribute("hidden");
		} else if (!this.menu.hasAttribute("hidden")) {
			this.menu.setAttribute("hidden", "");
		}
	};

	// open & close menu
	Nav.prototype.openClose = function() {
		// if drawer is open or closed
		let isOpen = JSON.parse(this.menuToggle.getAttribute("aria-expanded"));
		console.log({ isOpen });

		// loop over page elements to show / hide them
		// adding aria hidden to other pages elements traps screen reader focus
		const pageElements = Array.from(document.body.children);
		pageElements.forEach(el => {
			// ignore <script> tags
			if (el.tagName == "SCRIPT") return;

			let isNavParent = el.querySelector(`[${this.options.dataPrefix}]`)
				? true
				: false;
			// if is the element that contains the nav, need to hide things on a more
			// individal basis
			if (isNavParent) {
				const navParentElements = Array.from(el.children);
				navParentElements.forEach(ele => {
					if (ele.hasAttribute(`${this.options.dataPrefix}`)) return;
					accessibleShowHide(ele, !isOpen);
				});
			} else {
				accessibleShowHide(el, !isOpen);
			}
		});

		// actually open / close menu drawer
		if (!isOpen) {
			window.addEventListener("keydown", this.setMenuFocusTrap);
			this.menu.hidden = !this.menu.hidden;
			setTimeout(
				() => this.menuToggle.setAttribute("aria-expanded", !isOpen),
				100
			);
		} else {
			window.removeEventListener("keydown", this.setMenuFocusTrap);
			this.menuToggle.setAttribute("aria-expanded", !isOpen);
			setTimeout(
				() => (this.menu.hidden = !this.menu.hidden),
				this.options.animationDuration
			); //this settimeout needs to match the animation duration of the open/close
		}

		document.documentElement.classList.toggle("no-scroll");
	};

	// trap tab focus inside menu when its open
	const menuFocusTrap = function(e) {
		if (e.keyCode == 27) {
			// esc
			this.openClose();
		}
		if (e.keyCode == 9) {
			// tab
			let currentFocus = document.activeElement;
			let theoreticalFocusableChildren = Array.from(
				this.navigation.querySelectorAll(
					'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
				)
			);
			// remove hidden elements
			let technicallyFocusableChildren = theoreticalFocusableChildren.filter(
				el =>
					getComputedStyle(el).display !== "none" ||
					el.hasAttribute("hidden")
			);
			let focusableChildren;
			// if have child menus, remove items inside a closed child menu
			if (this.options.hasChildLists) {
				focusableChildren = technicallyFocusableChildren.filter(
					el =>
						!el.closest(`${this.options.childListSelector}`) ||
						getComputedStyle(
							el.closest(`${this.options.childListSelector}`)
						).display !== "none"
				);
			} else {
				focusableChildren = technicallyFocusableChildren;
			}
			let totalOfFocusable = focusableChildren.length;
			let focusIndex = focusableChildren.indexOf(currentFocus);

			if (e.shiftKey) {
				//tabbing backwards

				if (focusIndex === 0) {
					//first element is focused, go to last focusable child
					e.preventDefault();
					focusableChildren[totalOfFocusable - 1].focus();
				}
			} else {
				// tabbing forwards
				if (focusIndex == totalOfFocusable - 1) {
					// last element is focused, go to first focusable child
					e.preventDefault();
					focusableChildren[0].focus();
				}
			}
		}
	};

	// utility method to extend defaults with user options
	function extendDefaults(source, properties) {
		let property;
		for (property in properties) {
			if (properties.hasOwnProperty(property)) {
				source[property] = properties[property];
			}
		}
		return source;
	}

	// debounce util
	function debouce(callback, wait) {
		let timeout;
		return (...args) => {
			const context = this;
			clearTimeout(timeout);
			timeout = setTimeout(() => callback.apply(context, args), wait);
		};
	}

	// decided set either aria-hidden = true or remove aria-hidden,
	// as aria-hidden = false is inconsistent
	// https://www.w3.org/TR/wai-aria-1.1/#aria-hidden
	function accessibleShowHide(el, willOpen) {
		if (willOpen) {
			el.setAttribute("aria-hidden", true);
		} else {
			el.removeAttribute("aria-hidden");
		}
	}
})();
