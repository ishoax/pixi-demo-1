import { Container } from "pixi.js";
import { App } from "./App";

export class Scene {

	container: Container;

	constructor() {
		this.container = new Container();
		this.container.interactive = true;
		this.create();
		App.app.ticker.add(this.update, this);
	}

	create() {

	}

	update(dt: number) {

	}

	destroy() {

	}
}