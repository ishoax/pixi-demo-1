import gsap from "gsap";
import { ITextStyle, IPointData } from "pixi.js";

type Color = number;

export interface MinMax {
	min: number,
	max: number
}

export interface StrokeStyle {
	thickness: number;
	color: Color;
	quality: number;
}

export interface Score {
	x: number;
	y: number;
	anchor: number;
	style: Partial<ITextStyle>
}

export interface Background {
	width: number;
	height: number;
	color: Color;
	stroke: StrokeStyle
	radius: number;
}

export interface ScoreScreenBG extends Background {
	screenColor?: Color;
	screenPadding?: number;
}

export interface Text {
	position: IPointData;
	anchor: IPointData;
	style: Partial<ITextStyle>;
}

export interface TweenType {
	duration: number;
	ease: gsap.EaseFunction;
}

export interface Button {
	position: IPointData;
	bg: Background;
	text: Partial<Text>;
}

export interface ScoreScreen {
	background: ScoreScreenBG;
	button: Button;
	gameOver: Partial<Text>;
	score: Partial<Text>;
	highScore: Partial<Text>;
	tween: TweenType;
}

export interface Diamond {
	chance: number;
	offset: MinMax
}

export interface PlatformData {
	rows: number;
	cols: number;
	x: number;
}

export interface RandomPlatformData {
	rows: MinMax;
	cols: MinMax;
	offset: MinMax;
}

export interface Platform {
	moveSpeed: number;
	ranges: RandomPlatformData
}

export interface Hero {
	jumpSpeed: number,
	maxJumps: number,
	position: IPointData,
	particlePosition: IPointData;
}