import { Loader } from "pixi.js";
import { Config } from "../game/Config";

export class GameLoader {

	loader: Loader;
	config: Config;
	resources: {};

	constructor(loader: Loader, config: Config) {
		this.loader = loader;
		this.config = config;
		this.resources = {};
	}

	preload(): Promise<string> {
		for (const asset of this.config.loader) {
			let key = asset.key.substr(asset.key.lastIndexOf('/') + 1);
			key = key.substring(0, key.indexOf('.'));
			if (asset.key.indexOf(".png") !== -1 || asset.key.indexOf(".jpg") !== -1) {
				this.loader.add(key, asset.data.default)
			}
		}

		return new Promise<string>(resolve => {
			this.loader.load((loader, resources) => {
				this.resources = resources;
				resolve("loaded");
			});
		});
	}
}