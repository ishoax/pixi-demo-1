import * as Matter from 'matter-js';
import { LabelScore } from "./LabelScore";
import { App } from '../system/App';
import { Background } from "./Background";
import { Scene } from '../system/Scene';
import { Hero } from "./Hero";
import { Platforms } from "./Platforms";
import ScoreScreen from "./ScoreScreen";
import { save, SaveData } from "../system/Saving";

const GAME_STATE = {
	PLAYING: "playing",
	END: "end"
}

export class GameScene extends Scene {
	create() {
		this.createBackground();
		this.createHero();
		this.createPlatforms();
		this.setEvents();
		//[13]
		this.createUI();
		//[/13]

		this.state = GAME_STATE.PLAYING;

		if (process.env.NODE_ENV === 'development') {
			this.container.addChild(App.debugSprite);
		}
	}
	//[13]
	createUI() {
		this.labelScore = new LabelScore();
		this.container.addChild(this.labelScore);
		this.hero.on("score", () => {
			this.labelScore.renderScore(this.hero.score);
		});
	}
	//[13]

	setEvents() {
		Matter.Events.on(App.physics, 'collisionStart', this.onCollisionStart.bind(this));
	}

	onCollisionStart(event) {
		event.pairs.forEach(pair => {
			const colliders = [pair.bodyA, pair.bodyB];
			const hero = colliders.find(body => body.gameHero);
			const platform = colliders.find(body => body.gamePlatform);

			if (hero && platform) {
				this.hero.stayOnPlatform(platform.gamePlatform);
			}

			const diamond = colliders.find(body => body.gameDiamond);

			if (hero && diamond) {
				this.hero.collectDiamond(diamond.gameDiamond);
			}
		});
	}

	createHero() {
		this.hero = new Hero();
		this.container.addChild(this.hero);

		this.container.interactive = true;
		this.container.on("pointerdown", () => {
			this.hero.startJump();
		});

		// [14]
		this.hero.once("die", () => this.handleHeroDie());
		// [/14]
	}

	createBackground() {
		this.bg = new Background();
		this.container.addChild(this.bg.container);
	}

	createPlatforms() {
		this.platfroms = new Platforms();
		this.container.addChild(this.platfroms.container);
	}

	/**
	 * Handle Hero "die" event
	 */
	handleHeroDie() {
		// Clear events
		this.container.removeAllListeners();
		this.hero.removeAllListeners();
		
		// Update high score if needed
		const score = this.hero.score;
		if (SaveData.highScore <= score) {
			SaveData.highScore = score;
			save();
		}

		this.showScoreScreen();
	}

	/**
	 * Show the ScoreScreen
	 */
	showScoreScreen() {
		this.state = GAME_STATE.END;

		// Hide score label
		this.labelScore.visible = false;

		// Create and show score screen
		this.scoreScreen = new ScoreScreen(this.hero.score);
		this.container.addChild(this.scoreScreen);
		this.scoreScreen.show();

		// Handle restart button pushed
		this.scoreScreen.buttonCon.interactive = true;
		this.scoreScreen.buttonCon.once("pointerdown", () => App.scenes.start("Game"));
	}

	update(dt) {
		if (this.state === GAME_STATE.PLAYING) {
			this.bg.update(dt);
			this.platfroms.update(dt);

			if (process.env.NODE_ENV === 'development') {
				App.debugSprite.texture.update();
			}
		}
	}

	destroy() {
		Matter.Events.off(App.physics, 'collisionStart', this.onCollisionStart.bind(this));
		App.app.ticker.remove(this.update, this);
		this.bg.destroy();
		this.hero.destroy();
		this.platfroms.destroy();
		this.labelScore.destroy();
	}
}