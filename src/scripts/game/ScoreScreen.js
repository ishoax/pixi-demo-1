import { OutlineFilter } from '@pixi/filter-outline';
import gsap from "gsap";
import { Container, Graphics, Text } from "pixi.js";
import { App } from "../system/App";
import { SaveData } from "../system/Saving";

/**
 * Score screen that displays the player's current score and high score allowing them to restart a new game
 */
export default class ScoreScreen extends Container {

	/**
	 * Constructor
	 * @param {number} playerScore - player's current score
	 */
	constructor(playerScore = 0) {
		super();

		this.create(playerScore);

		this.x = App.config.gameWidth / 2;
		this.y = App.config.gameHeight + (this.getBounds().height / 2); // Offscreen
	}

	/**
	 * Create the ScoreScreen children
	 * @param {number} playerScore - player's current score
	 */
	create(playerScore) {
		const bgData = App.config.scoreScreen.background;
		const bgStrokeData = bgData.bgStroke;
		const screenPadding = bgData.screenPadding;

		// Holds the graphical background pieces
		const backgroundContainer = new Container();

		// Create background shapes
		// Colors and shapes match the little Hero
		const bgBody = new Graphics();
		bgBody.beginFill(bgData.bgColor);
		bgBody.drawRoundedRect(-bgData.width / 2, -bgData.height / 2, bgData.width, bgData.height, bgData.radius);
		bgBody.filters = [new OutlineFilter(bgStrokeData.thickness, bgStrokeData.color, bgStrokeData.quality)];

		const gameScreen = new Graphics();
		bgBody.beginFill(bgData.screenColor);
		bgBody.drawRoundedRect(-bgData.width / 2 + screenPadding, -bgData.height / 2 + screenPadding, bgData.width - (screenPadding * 2), bgData.height * 0.6, bgData.radius);

		backgroundContainer.addChild(
			bgBody,
			gameScreen
		);

		// Holds the text pieces that go in the background screen
		const textContainer = new Container();

		// Game over text
		const gameOverData = App.config.scoreScreen.gameOver;
		const gameOverText = new Text("Game Over", gameOverData.style);
		gameOverText.anchor.copyFrom(gameOverData.anchor);
		gameOverText.position.copyFrom(gameOverData.position);

		// Score text
		const scoreData = App.config.scoreScreen.score;
		const scoreText = new Text(`Score: ${playerScore}`, scoreData.style);
		scoreText.anchor.copyFrom(scoreData.anchor);
		scoreText.position.copyFrom(scoreData.position);

		// Highscore text
		const highScoreData = App.config.scoreScreen.highScore;
		const highScoreText = new Text(`High Score: ${SaveData.highScore}`, highScoreData.style);
		highScoreText.anchor.copyFrom(highScoreData.anchor);
		highScoreText.position.copyFrom(highScoreData.position);

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
		buttonBg.filters = [new OutlineFilter(buttonBGStrokeData.thickness, buttonBGStrokeData.color, buttonBGStrokeData.quality)];

		const buttonText = new Text("Restart", buttonTextData.style);
		buttonText.anchor.copyFrom(buttonTextData.anchor);
		buttonText.position.copyFrom(buttonTextData.position);

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