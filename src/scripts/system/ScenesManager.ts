import { Container } from "pixi.js";
import { App } from "./App";
import { Scene } from "./Scene";

export class ScenesManager {

	container: Container;
	scene: Scene;

	constructor() {
		this.container = new Container();
		this.container.interactive = true;
	}

	start(scene: string) {
		if (this.scene) {
			this.scene.destroy();
		}

		this.scene = new App.config.scenes[scene]();
		this.container.addChild(this.scene.container);
	}

	update(dt: number) {
		if (this.scene && this.scene.update) {
			this.scene.update(dt);
		}
	}
}