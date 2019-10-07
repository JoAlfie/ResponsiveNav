(function() {
	// define constructor
	this.Nav = function() {
		// gloval element references
		this.navigation = null;
		this.menuToggle = null;
		this.menu = null;

		// define option defaults
		const defaults = {
			dataPrefix: "data-respnav",
			breakpoint: 768,
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
})();
