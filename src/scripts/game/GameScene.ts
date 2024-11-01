import { Engine, Events, IEventCollision, Pair } from 'matter-js';
import { App } from '../system/App';
import { save, SaveData } from "../system/Saving";
import { Scene } from '../system/Scene';
import { Background } from "./Background";
import { Diamond } from './Diamond';
import { Hero } from "./Hero";
import { LabelScore } from "./LabelScore";
import { Platform } from './Platform';
import { Platforms } from "./Platforms";
import ScoreScreen from "./ScoreScreen";

// States of gameplay
enum GAME_STATE {
	PLAYING = "playing",
	END = "end"
}

export class GameScene extends Scene {

	protected state: GAME_STATE;
	protected labelScore: LabelScore;
	protected hero: Hero;
	protected bg: Background;
	protected platforms: Platforms;
	protected scoreScreen: ScoreScreen;

	create() {
		this.createBackground();
		this.createHero();
		this.createPlatforms();
		this.setEvents();
		//[13]
		this.createUI();
		//[/13]

		this.state = GAME_STATE.PLAYING;

		if (process.env.NODE_ENV === 'development' && App.debugSprite) {
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
		Events.on(App.physics, 'collisionStart', (event: IEventCollision<Engine>) => this.onCollisionStart(event));
	}

	onCollisionStart(event: IEventCollision<Engine>) {
		event.pairs.forEach((pair: Pair) => {
			const colliders = [pair.bodyA, pair.bodyB];
			const hero = colliders.find(body => Hero.isHero(body));
			const platform = colliders.find(body => Platform.isPlatform(body));

			if (hero && platform) {
				this.hero.stayOnPlatform(platform.gamePlatform);
			}

			const diamond = colliders.find(body => Diamond.isDiamond(body));

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
		this.platforms = new Platforms();
		this.container.addChild(this.platforms.container);
	}

	/**
	 * Handle Hero "die" event
	 */
	handleHeroDie() {
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

	update(dt: number) {
		if (this.state === GAME_STATE.PLAYING) {
			this.bg.update(dt);
			this.platforms.update(dt);

			if (process.env.NODE_ENV === 'development' && App.debugSprite) {
				App.debugSprite.texture.update();
			}
		}
	}

	destroy() {
		Events.off(App.physics, 'collisionStart', this.onCollisionStart.bind(this));
		App.app.ticker.remove(this.update, this);
		this.bg.destroy();
		this.hero.destroy();
		this.platforms.destroy();
		this.labelScore.destroy();
	}
}