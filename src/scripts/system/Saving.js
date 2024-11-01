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
	const loadData = JSON.parse(localStorage.getItem(key));
	// If data loaded update save data object
	if (loadData) {
		SaveData = loadData;
	}
}

// Initial load
load();