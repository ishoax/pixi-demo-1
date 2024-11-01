import { Engine, Runner, Render } from 'matter-js';
import { Application, DisplayObject, Graphics, VERSION, Sprite, Texture } from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { ScenesManager } from "./ScenesManager";
import { Config } from '../game/Config';
import { GameLoader } from './GameLoader';

class Game {

	public config: Config;
	public app: Application;
	public scenes: ScenesManager;
	public debugSprite?: Sprite;
	public physics: Engine;

	protected loader: GameLoader;
	protected render: Render;

	run(config: Config) {
		gsap.registerPlugin(PixiPlugin);
		PixiPlugin.registerPIXI({
			DisplayObject,
			Graphics,
			VERSION,
		});

		this.config = config;

		this.app = new Application({ resizeTo: window });
		document.body.appendChild(this.app.view);

		this.loader = new GameLoader(this.app.loader, this.config);
		this.loader.preload().then(() => this.start());

		this.scenes = new ScenesManager();
		this.app.stage.interactive = true;
		this.app.stage.addChild(this.scenes.container);

		// [06]
		this.createPhysics();
	}

	createPhysics() {
		this.physics = Engine.create();
		const runner = Runner.create();
		Runner.run(runner, this.physics);

		if (process.env.NODE_ENV === 'development') {
			this.render = Render.create({
				engine: this.physics,
				options: {
					width: window.innerWidth,
					height: window.innerHeight
				},
			});

			this.debugSprite = new Sprite(Texture.from(this.render.canvas));
			Render.run(this.render);
		}
	}
	// [/06]

	sprite(key: string): Sprite {
		return new Sprite(Texture.from(key));
	}

	start() {
		this.scenes.start("Game");
	}
}

export const App: Game = new Game();