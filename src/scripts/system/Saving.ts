const key = "pixi_demo_1";

/**
 * Save data object for localStorage
 */
export let SaveData = {
	highScore: 0
}

/**
 * Save our data object
 */
export function save() {
	localStorage.setItem(key, JSON.stringify(SaveData));
}

/**
 * Load our data object if player has save data
 */
export function load() {
	const item = localStorage.getItem(key);
	// If local storage has a return item
	if (item) {
		// If data loaded update save data object
		SaveData = JSON.parse(item);
	}
}

// Initial load
load();