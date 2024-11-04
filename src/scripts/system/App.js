import * as Matter from 'matter-js';
import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { Loader } from "./Loader";
import { ScenesManager } from "./ScenesManager";

class Application {
    run(config) {
        gsap.registerPlugin(PixiPlugin);
        PixiPlugin.registerPIXI(PIXI);

        this.config = config;

        this.app = new PIXI.Application({ width: config.gameWidth, height: config.gameHeight });
        document.body.appendChild(this.app.view);

        this.loader = new Loader(this.app.loader, this.config);
        this.loader.preload().then(() => this.start());

        this.scenes = new ScenesManager();
        this.app.stage.interactive = true;
        this.app.stage.addChild(this.scenes.container);

        // [06]
        this.createPhysics(config);
    }

    createPhysics(config) {
        this.physics = Matter.Engine.create();
        const runner = Matter.Runner.create();
        Matter.Runner.run(runner, this.physics);

		if (process.env.NODE_ENV === 'development') {
			this.render = Matter.Render.create({
				engine: this.physics,
				options: {
					width: config.gameWidth,
					height: config.gameHeight,
				},
			});

			this.debugSprite = new PIXI.Sprite(PIXI.Texture.from(this.render.canvas));
			Matter.Render.run(this.render);
		}
    }
    // [/06]

    res(key) {
        return this.loader.resources[key].texture;
    }

    sprite(key) {
        return new PIXI.Sprite(this.res(key));
    }

    start() {
        this.scenes.start("Game");
    }
}

export const App = new Application();