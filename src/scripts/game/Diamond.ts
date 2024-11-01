import { World, Bodies, Body } from 'matter-js';
import { App } from '../system/App';
import { Sprite } from 'pixi.js';

export interface IDiamondBody {
	gameDiamond: Diamond;
}

export class Diamond {

	protected body: Body & IDiamondBody;

	public sprite: Sprite | null;

	constructor(x: number, y: number) {
		this.createSprite(x, y);
		App.app.ticker.add(this.update, this);
	}

	static isDiamond(obj: any): obj is IDiamondBody {
		return obj.gameDiamond;
	}

	createSprite(x: number, y: number) {
		this.sprite = App.sprite("diamond");
		this.sprite.x = x;
		this.sprite.y = y;
	}

	update() {
		if (this.sprite) {
			Body.setPosition(this.body, { x: this.sprite.width / 2 + this.sprite.x + this.sprite.parent.x, y: this.sprite.height / 2 + this.sprite.y + this.sprite.parent.y });
		}
	}

	createBody() {
		if (this.sprite) {
			this.body = Bodies.rectangle(
				this.sprite.width / 2 + this.sprite.x + this.sprite.parent.x,
				this.sprite.height / 2 + this.sprite.y + this.sprite.parent.y,
				this.sprite.width,
				this.sprite.height,
				{ friction: 0, isStatic: true, render: { fillStyle: '#060a19' } }
			) as Body & IDiamondBody;
			this.body.isSensor = true;
			this.body.gameDiamond = this;
			World.add(App.physics.world, this.body);
		}
	}

	// [14]
	destroy() {
		if (this.sprite) {
			App.app.ticker.remove(this.update, this);
			World.remove(App.physics.world, this.body);
			this.sprite.destroy();
			this.sprite = null;
		}
	}
}