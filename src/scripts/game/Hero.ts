import { Emitter, upgradeConfig } from "@pixi/particle-emitter";
import { Bodies, Body, World } from 'matter-js';
import { AnimatedSprite, Container, Texture } from "pixi.js";
import jumpEmitterJSON from "../data/jump-emitter.json";
import { App } from '../system/App';
import { Diamond } from './Diamond';
import { Platform } from './Platform';

export interface IHeroBody {
	gameHero: Hero;
}

/**
 * Hero class the player controls
 */
export class Hero extends Container {

	protected jumpTexture: Texture;
	protected walkTextures: Texture[];
	protected platform: Platform | null;
	protected emitter: Emitter;
	protected body: Body & IHeroBody;
	protected emitterContainer: Container;
	protected jumpIndex: number;
	protected maxJumps: number;
	protected jumpSpeed: number;

	public sprite: AnimatedSprite;
	public score: number;

	constructor() {
		super();

		this.jumpTexture = Texture.from("jump");
		this.walkTextures = [Texture.from("walk1"), Texture.from("walk2")];

		this.createSprite();
		this.positionHero();
		this.createBody();
		this.createParticleEmitter();
		App.app.ticker.add(this.update, this);

		this.jumpSpeed = App.config.hero.jumpSpeed;
		this.maxJumps = App.config.hero.maxJumps;
		this.jumpIndex = 0;
		this.score = 0;
	}

	/**
	 * Return if the object provided is a IHeroBody with gameHero property
	 * @param {*} 
	 * @returns {boolean}
	 */
	static isHero(obj: any): obj is IHeroBody {
		return obj.gameHero;
	}

	/**
	 * Create the visual animated sprite
	 */
	createSprite() {
		this.sprite = new AnimatedSprite(this.walkTextures);
		this.sprite.loop = true;
		this.sprite.animationSpeed = 0.1;
		this.sprite.play();
		this.addChild(this.sprite);
	}

	/**
	 * Create the physics body for the Hero
	 */
	createBody() {
		this.body = Bodies.rectangle(
			this.x + this.sprite.width / 2,
			this.y + this.sprite.height / 2,
			this.sprite.width,
			this.sprite.height,
			{ friction: 0, inertia: Infinity }
		) as Body & IHeroBody;
		World.add(App.physics.world, this.body);
		this.body.gameHero = this;
	}

	/**
	 * Create particle emitter for mid air jump
	 */
	createParticleEmitter() {
		const updatedConfig = upgradeConfig(jumpEmitterJSON, [Texture.from("box25px"), Texture.from("box50px")]);
		// @ts-ignore - Emitter is looking for a "Container" on 
		this.emitter = new Emitter(this, updatedConfig);
		const particlePos = App.config.hero.particlePosition;
		this.emitter.updateSpawnPos(particlePos.x, particlePos.y);
		this.emitter.emit = false;
		this.emitter.autoUpdate = true;
	}

	/**
	 * Position hero in the world
	 */
	positionHero() {
		// Depending on the window height of the user's browser the Hero will automatically die if the browser window is too small
		// Calculate the Hero above the initial starting platform created 
		const tileHeight = Texture.from("tile").height;
		const rows = App.config.initialPlatform.rows;
		this.x = App.config.hero.position.x;
		this.y = App.config.gameHeight - (tileHeight * rows);
	}

	/**
	 * Player collected a diamond increase score
	 * @param {Diamond} diamond - diamond to be collected
	 */
	collectDiamond(diamond: Diamond) {
		++this.score;
		//[13]
		this.emit("score");
		//[/13]
		diamond.destroy();
	}
	//[/12]

	/**
	 * Start player jump if player on a platform or midair jump if it has not been used
	 */
	startJump() {
		const jumpIndex1 = this.jumpIndex === 1;
		if (this.platform || jumpIndex1) {
			// Mid air jump visual feedback
			if (jumpIndex1) {
				this.emitter.playOnce();
			}
			++this.jumpIndex;
			this.platform = null;
			Body.setVelocity(this.body, { x: 0, y: -this.jumpSpeed });
			// Set jump sprite texture
			this.sprite.stop();
			this.sprite.texture = this.jumpTexture;
		}
	}

	// [08]
	/**
	 * Player landed on a platform, reset jump
	 * @param {Platform} platform - platform player landed on
	 */
	stayOnPlatform(platform: Platform) {
		this.platform = platform;
		this.jumpIndex = 0;
		// Resume playing of walk cycle on platform
		this.sprite.textures = this.walkTextures;
		this.sprite.play();
	}
	// [/08]

	/**
	 * RAF
	 */
	update() {
		this.x = this.body.position.x - this.sprite.width / 2;
		this.y = this.body.position.y - this.sprite.height / 2;

		// [14]
		// If sprite falls offscreen either down or past the left side of the screen kill Hero
		if (this.y > App.config.gameHeight || this.x < -this.sprite.width) {
			this.emit("die");
		}
		// [/14]
	}

	/**
	 * Destroy this Hero
	 */
	destroy() {
		App.app.ticker.remove(this.update, this);
		World.add(App.physics.world, this.body);
		super.destroy();
	}
}