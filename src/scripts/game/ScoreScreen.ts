import { OutlineFilter } from '@pixi/filter-outline';
import gsap from "gsap";
import { Container, Filter, Graphics, Point, Text } from "pixi.js";
import { App } from "../system/App";
import { SaveData } from "../system/Saving";

/**
 * Score screen that displays the player's current score and high score allowing them to restart a new game
 */
export default class ScoreScreen extends Container {

	public buttonCon: Container;

	/**
	 * Constructor
	 * @param {number} playerScore - player's current score
	 */
	constructor(playerScore: number = 0) {
		super();

		this.create(playerScore);

		this.x = App.config.gameWidth / 2;
		this.y = App.config.gameHeight + (this.getBounds().height / 2); // Offscreen
	}

	/**
	 * Create the ScoreScreen children
	 * @param {number} playerScore - player's current score
	 */
	create(playerScore: number) {
		const bgData = App.config.scoreScreen.background;
		const bgStrokeData = bgData.stroke;
		const screenPadding = bgData.screenPadding;

		// Holds the graphical background pieces
		const backgroundContainer = new Container();

		// Create background shapes
		// Colors and shapes match the little Hero
		const bgBody = new Graphics();
		bgBody.beginFill(bgData.color);
		bgBody.drawRoundedRect(-bgData.width / 2, -bgData.height / 2, bgData.width, bgData.height, bgData.radius);
		// @ts-ignore - other filters that come WITH Pixi.js seem to work but OutlineFilter errors
		bgBody.filters = [new OutlineFilter(bgStrokeData.thickness, bgStrokeData.color, bgStrokeData.quality)];

		const gameScreen = new Graphics();
		bgBody.beginFill(bgData.screenColor);
		bgBody.drawRoundedRect(-bgData.width / 2 + (screenPadding || 0), -bgData.height / 2 + (screenPadding || 0), bgData.width - ((screenPadding || 0) * 2), bgData.height * 0.6, bgData.radius);

		backgroundContainer.addChild(
			bgBody,
			gameScreen
		);

		// Holds the text pieces that go in the background screen
		const textContainer = new Container();

		// Game over text
		const gameOverData = App.config.scoreScreen.gameOver;
		const gameOverText = new Text("Game Over", gameOverData.style);
		gameOverText.anchor.copyFrom(gameOverData.anchor as Point);
		gameOverText.position.copyFrom(gameOverData.position as Point);

		// Score text
		const scoreData = App.config.scoreScreen.score;
		const scoreText = new Text(`Score: ${playerScore}`, scoreData.style);
		scoreText.anchor.copyFrom(scoreData.anchor as Point);
		scoreText.position.copyFrom(scoreData.position as Point);

		// Highscore text
		const highScoreData = App.config.scoreScreen.highScore;
		const highScoreText = new Text(`High Score: ${SaveData.highScore}`, highScoreData.style);
		highScoreText.anchor.copyFrom(highScoreData.anchor as Point);
		highScoreText.position.copyFrom(highScoreData.position as Point);

		textContainer.addChild(
			gameOverText,
			scoreText,
			highScoreText,
		);

		// Restart button
		const buttonData = App.config.scoreScreen.button;
		const buttonBGData = buttonData.bg;
		const buttonBGStrokeData = buttonBGData.stroke;
		const buttonTextData = buttonData.text;

		this.buttonCon = new Container();
		this.buttonCon.position.copyFrom(buttonData.position);

		const buttonBg = new Graphics();
		buttonBg.beginFill(buttonBGData.color);
		buttonBg.drawRoundedRect(-buttonBGData.width / 2, -buttonBGData.height / 2, buttonBGData.width, buttonBGData.height, buttonBGData.radius);
		// @ts-ignore - other filters that come WITH Pixi.js seem to work but OutlineFilter errors
		buttonBg.filters = [new OutlineFilter(buttonBGStrokeData.thickness, buttonBGStrokeData.color, buttonBGStrokeData.quality)];

		const buttonText = new Text("Restart", buttonTextData.style);
		buttonText.anchor.copyFrom(buttonTextData.anchor as Point);
		buttonText.position.copyFrom(buttonTextData.position as Point);

		this.buttonCon.addChild(
			buttonBg,
			buttonText,
		);

		this.addChild(
			backgroundContainer,
			textContainer,
			this.buttonCon,
		);
	}

	/**
	 * Animate the ScoreScreen into player view
	 */
	show() {
		const tweenData = App.config.scoreScreen.tween;
		gsap.to(this, {
			pixi: { y: App.config.gameHeight / 2 }, // Center ScoreScreen in the window
			duration: tweenData.duration,
			ease: tweenData.ease,
		});
	}

}