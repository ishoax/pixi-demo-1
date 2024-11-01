import gsap from "gsap";
import { ITextStyle, IPointData } from "pixi.js";

type Color = number;

interface IMinMax {
	min: number,
	max: number
}

interface IStrokeStyle {
	thickness: number;
	color: Color;
	quality: number;
}

interface ITextData {
	position: IPointData;
	anchor: IPointData;
	style: Partial<ITextStyle>;
}

interface ITweenData {
	duration: number;
	ease: gsap.EaseFunction;
}

interface IBGStyle {
	width: number;
	height: number;
	color: Color;
	stroke: IStrokeStyle
	radius: number;
}

interface IScoreBGStyle extends IBGStyle {
	screenColor?: Color;
	screenPadding?: number;
}

interface IButtonStyle {
	position: IPointData;
	bg: IBGStyle;
	text: Partial<ITextData>;
}

export interface IDiamondData {
	chance: number;
	offset: IMinMax
}

export interface ISinglePlatformData {
	rows: number;
	cols: number;
	x: number;
}

export interface IRandomPlatformData {
	rows: IMinMax;
	cols: IMinMax;
	offset: IMinMax;
}

export interface IPlatformData {
	moveSpeed: number;
	ranges: IRandomPlatformData
}

export interface IHeroData {
	jumpSpeed: number,
	maxJumps: number,
	position: IPointData,
	particlePosition: IPointData;
}

export interface IScoreStyle {
	x: number;
	y: number;
	anchor: number;
	style: Partial<ITextStyle>
}

export interface IScoreScreenStyle {
	background: IScoreBGStyle;
	button: IButtonStyle;
	gameOver: Partial<ITextData>;
	score: Partial<ITextData>;
	highScore: Partial<ITextData>;
	tween: ITweenData;
}