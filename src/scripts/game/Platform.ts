import { Bodies, Body, World } from 'matter-js';
import { Container, Texture } from "pixi.js";
import { App } from '../system/App';
// [10]
import { Diamond } from './Diamond';
// [/10]

export interface IPlatformBody {
	gamePlatform: Platform;
}

export class Platform {

	protected diamonds: Diamond[];
	protected rows: number;
	protected cols: number;
	protected x: number;
	protected tileSize: number;
	protected width: number;
	protected height: number;
	protected moveSpeed: number;
	protected body: Body & IPlatformBody;

	public container: Container;

	constructor(rows: number, cols: number, x: number) {
		// [10]
		this.diamonds = [];
		// [/10]

		this.rows = rows;
		this.cols = cols;

		this.tileSize = Texture.from("tile").width;
		this.width = this.tileSize * this.cols;
		this.height = this.tileSize * this.rows;

		this.createContainer(x);
		this.createTiles();

		this.moveSpeed = App.config.platforms.moveSpeed;
		this.createBody();
		this.createDiamonds();
	}

	static isPlatform(obj: any): obj is IPlatformBody {
		return obj.gamePlatform;
	}

	// [10]
	createDiamonds() {
		const y = App.config.diamonds.offset.min + Math.random() * (App.config.diamonds.offset.max - App.config.diamonds.offset.min);

		for (let i = 0; i < this.cols; i++) {
			if (Math.random() < App.config.diamonds.chance) {
				this.createDiamond(this.tileSize * i, -y);
			}
		}
	}

	createDiamond(x: number, y: number) {
		const diamond = new Diamond(x, y);
		if (diamond.sprite) {
			this.container.addChild(diamond.sprite);
		}
		diamond.createBody();
		this.diamonds.push(diamond);
	}
	// [/10]

	createBody() {
		this.body = Bodies.rectangle(
			this.width / 2 + this.container.x,
			this.height / 2 + this.container.y,
			this.width,
			this.height,
			{ friction: 0, isStatic: true }
		) as Body & IPlatformBody;
		World.add(App.physics.world, this.body);
		this.body.gamePlatform = this;
	}

	createContainer(x: number) {
		this.container = new Container();
		this.container.x = x;
		this.container.y = App.config.gameHeight - this.height;
	}

	createTiles() {
		for (let row = 0; row < this.rows; row++) {
			for (let col = 0; col < this.cols; col++) {
				this.createTile(row, col);
			}
		}
	}

	createTile(row: number, col: number) {
		const texture = row === 0 ? "platform" : "tile"
		const tile = App.sprite(texture);
		this.container.addChild(tile);
		tile.x = col * tile.width;
		tile.y = row * tile.height;
	}


	// 06
	move() {
		if (this.body) {
			Body.setPosition(this.body, { x: this.body.position.x + this.moveSpeed, y: this.body.position.y });
			this.container.x = this.body.position.x - this.width / 2;
			this.container.y = this.body.position.y - this.height / 2;
		}
	}

	destroy() {
		World.remove(App.physics.world, this.body);
		this.diamonds.forEach(diamond => diamond.destroy());
		this.container.destroy();
	}
}