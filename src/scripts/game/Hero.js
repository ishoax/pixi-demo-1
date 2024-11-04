import * as Matter from 'matter-js';
import * as PIXI from "pixi.js";
import { App } from '../system/App';
import { Emitter, upgradeConfig } from "@pixi/particle-emitter";
import jumpEmitterJSON from "../data/jump-emitter.json";

export class Hero extends PIXI.Container {
    constructor() {
		super();

		this.jumpTexture =App.res("jump");
		this.walkTextures = [App.res("walk1"), App.res("walk2")];

		this.createSprite();
		this.positionHero();
        this.createBody();
		this.createParticleEmitter();
        App.app.ticker.add(this.update, this);

        this.dy = App.config.hero.jumpSpeed;
        this.maxJumps = App.config.hero.maxJumps;
        this.jumpIndex = 0;
        this.score = 0;
    }

    collectDiamond(diamond) {
        ++this.score;
        //[13]
        this.emit("score");
        //[/13]
        diamond.destroy();
    }
    //[/12]

    startJump() {
		const jumpIndex1 = this.jumpIndex === 1;
        if (this.platform || jumpIndex1) {
			// Mid air jump visual feedback
			if(jumpIndex1){
				this.emitter.playOnce();
			}
            ++this.jumpIndex;
            this.platform = null;
            Matter.Body.setVelocity(this.body, { x: 0, y: -this.dy });
			// Set jump sprite texture
			this.sprite.stop();
			this.sprite.texture = this.jumpTexture;
        }
    }

    // [08]
    stayOnPlatform(platform) {
        this.platform = platform;
        this.jumpIndex = 0;
		// Resume playing of walk cycle on platform
		this.sprite.textures = this.walkTextures;		
		this.sprite.play();		
    }
    // [/08]

    createBody() {
        this.body = Matter.Bodies.rectangle(this.x + this.sprite.width / 2, this.y + this.sprite.height / 2, this.sprite.width, this.sprite.height, {friction: 0, inertia: Infinity});
        Matter.World.add(App.physics.world, this.body);
        this.body.gameHero = this;
    }

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

	createSprite() {
		this.sprite = new PIXI.AnimatedSprite(this.walkTextures);
		this.sprite.loop = true;
		this.sprite.animationSpeed = 0.1;
		this.sprite.play();
		this.addChild(this.sprite);
	}

	positionHero() {
		// Depending on the window height of the user's browser the Hero will automatically die if the browser window is too small
		// Calculate the Hero above the initial starting platform created 
		const tileHeight = PIXI.Texture.from("tile").height;
		this.x = App.config.hero.position.x;
		this.y = App.config.gameHeight - (tileHeight * App.config.initialPlatform.rows);
	}

	/**
	 * Create particle emitter for mid air jump
	 */
	createParticleEmitter() {
		const updatedConfig = upgradeConfig(jumpEmitterJSON, [App.res("box25px"), App.res("box50px")]);
		this.emitter = new Emitter(this, updatedConfig);
		const particlePos = App.config.hero.particlePosition;
		this.emitter.updateSpawnPos(particlePos.x, particlePos.y);
		this.emitter.emit = false;
		this.emitter.autoUpdate = true;
	}

    destroy() {
        App.app.ticker.remove(this.update, this);
        Matter.World.add(App.physics.world, this.body);
        super.destroy();
    }
}