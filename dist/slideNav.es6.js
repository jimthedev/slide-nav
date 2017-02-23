/*
 * slide-nav 1.0.0
 * ES6 Vanilla.js navigation plugin to simple use on one-page websites.
 * https://github.com/qmixi/slide-nav
 *
 * Copyright (C) 2017 - A project by Piotr Kumorek
 * Released under the MIT license.
*/

class SlideNav {

	constructor(options) {
		//default values
		this.activeClass = options.activeClass || 'active';
		this.toggleButtonSelector = options.toggleButtonSelector || false;
		this.toggleBoxSelector = options.toggleBoxSelector || false;
		this.speed = options.speed > 0 ? options.speed : 250;
		this.hideAfterSelect = options.hideBoxAfterSelect || true;
		this.changeHash = options.changeHash || false;
		this.navBoxToggleClass = options.navBoxToggleClass || false;

		//initialize
		this.init();
	}

	init() {
		//scrollDoc
		this.scrollDoc = document.scrollingElement || document.documentElement;

		this.getElements();
		this.observe();
		this.setActiveAnchor();
	}

	getElements() {
		this.toggleButton = document.querySelector(this.toggleButtonSelector);
		if(this.toggleButton) {
			this.opened = false;
		}
		this.toggleBoxes = document.querySelectorAll(this.toggleBoxSelector);
		this.navAnchors = document.querySelectorAll('a:not([target="_blank"])');
	}

	observe() {
		//blur navBox
		window.addEventListener("click", (e) => {
			if(this.opened && !this.isClosestElement(e.target, this.toggleButton) && !this.isBoxNavTarget(e.target)) {
				this.hideNavBox();
			}
		});
		// toggle button
		this.toggleButton.addEventListener("click", (e) => {
			setTimeout(() => {
				this.opened ? this.hideNavBox() : this.showNavBox();
			});
		});
		// anchors
		for(let anchor of this.navAnchors) {
			anchor.addEventListener("click", (e) => {
				e.preventDefault();
				let linkHash = this.getHash(e.currentTarget.href);
				if(!this.goToSection(linkHash) && e.currentTarget.href) this.goToUrl(e.currentTarget.href);
			});
		};
		// scroll
		window.addEventListener("scroll", () => {
			this.setActiveAnchor();
		});
	}

	setActiveAnchor() {
		for(let anchor of this.navAnchors) {
			const linkHash = this.getHash(anchor.href),
				section = this.getSection(linkHash),
				offset = this.scrollDoc.scrollTop;

			if(section && (section.offsetTop <= offset) && (section.offsetTop + section.offsetHeight > offset)) {
				console.log("piesa");
				for(let link of this.navAnchors) {
					if(link.href != anchor.href) link.classList.remove('active');
				}
				anchor.classList.add('active');
			}
		}
	}

	goToSection(linkHash) {
		const section = this.getSection(linkHash);
		if(section) {
			const offsetTop = section.offsetTop;
			this.scrollTo(offsetTop, this.speed);
			if(this.hideAfterSelect) this.hideNavBox();
			return true;
		} else {
			return false;
		}
	}

	scrollTo(destOffset, duration) {
		const diffOffset = destOffset - this.scrollDoc.scrollTop,
			partDist = diffOffset / duration * 8;

		if (duration <= 0) return;
		setTimeout(() => {
			this.scrollDoc.scrollTop = this.scrollDoc.scrollTop + partDist;
			if (this.scrollDoc.scrollTop == destOffset) return;
			this.scrollTo(destOffset, duration - 8);
		}, 8);
	}

	goToUrl(url) {
		return window.location = url;
	}

	getSection(linkHash) {
		const id = "#" + linkHash;
		return document.querySelector(id);
	}

	getHash(href) {
		return href.split('#')[1];
	}

	isBoxNavTarget(target) {
		var isTarget = false;
		for(let box of this.toggleBoxes) {
			if(this.isClosestElement(target, box)) isTarget = true;
		}
		return isTarget;
	}

	isClosestElement(target, element) {
		while(element != target) {
			target = target.parentNode;
			if (!target) return false;
		}
		return true;
	}

	hideNavBox() {
		for(let box of this.toggleBoxes) {
			if(this.navBoxToggleClass) {
				box.classList.remove(this.navBoxToggleClass);
			} else {
				box.style.display = 'none';
			}
		}
		this.opened = false;
	}

	showNavBox() {
		for(let box of this.toggleBoxes) {
			if(this.navBoxToggleClass) {
				box.classList.add(this.navBoxToggleClass);
			} else {
				box.style.display = 'block';
			}
		}
		this.opened = true;
	}
}