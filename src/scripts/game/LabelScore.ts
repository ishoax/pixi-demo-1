import { Text } from "pixi.js";
import { App } from "../system/App";

export class LabelScore extends Text {

	constructor() {
		super();
		this.x = App.config.score.x;
		this.y = App.config.score.y;
		this.anchor.set(App.config.score.anchor);
		this.style = Object.assign(this.style, App.config.score.style);
		this.renderScore();
	}

	renderScore(score = 0) {
		this.text = `Score: ${score}`;
	}
}