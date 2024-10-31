import { Back } from "gsap";
import { Tools } from "../system/Tools";
import { GameScene } from "./GameScene";

export const Config = {
    loader: Tools.massiveRequire(require["context"]('./../../sprites/', true, /\.(mp3|png|jpe?g)$/)),
    bgSpeed: 3,
    score: {
        x: 10,
        y: 10,
        anchor: 0,
        style: {
            fontFamily: "Verdana",
            fontWeight: "bold",
            fontSize: 44,
            fill: ["#FF7F50"]
        }
    },
	scoreScreen: {
		background: {
			width: 400,
			height: 450,
			bgColor: 0xffab1a,
			bgStroke: {
				thickness: 8,
				color: 0xe99416,
				quality: 0.4
			},
			screenColor: 0xacc254,
			screenPadding: 20,	
			radius: 20
		},
		button: {
			position: {
				x: 0,
				y: 145
			},
			bg: {
				width: 160,
				height: 60,
				radius: 20,
				color: 0xf66723,
				stroke: {
					thickness: 8,
					color: 0x626262,
					quality: 0.4
				},
			},
			text: {
				anchor: {
					x: 0.5,
					y: 0.5
				},
				position: {
					x: 0,
					y: -2,
				},
				style: {
					fontFamily: "Verdana",
					fontWeight: "bold",
					fontSize: 30,
					fill: "#FFFFFF"
				}
			}			
		},
		gameOver: {
			anchor: {
				x: 0.5,
				y: 0,
			},
			position: {
				x: 0,
				y: -175
			},
			style: { 
				fontFamily: "Verdana",
            	fontWeight: "bold",
				fontSize: 50,
				fill: "#FFFFFF",            
			}			
		},
		score: {
			anchor: {
				x: 0.5,
				y: 0,
			},
			position: {
				x: 0,
				y: -85,
			},
			style: { 
				fontFamily: "Verdana",
				fontWeight: "normal",
				fontSize: 40,
				fill: "#FFFFFF",
			}	
		},
		highScore: {
			anchor: {
				x: 0.5,
				y: 0,
			},
			position: {
				x: 0,
				y: -25,
			},
			style: { 
				fontFamily: "Verdana",
				fontWeight: "normal",
				fontSize: 40,
				fill: "#FFFFFF",
			}
		},
		tween: {
			duration: 0.5,
			ease: Back.easeOut
		}
	},
    diamonds: {
        chance: 0.4,
        offset: {
            min: 100,
            max: 200
        }
    },
    platforms: {
        moveSpeed: -4,
        ranges: {
            rows: {
                min: 2,
                max: 6
            },
            cols: {
                min: 3,
                max: 9
            },
            offset: {
                min: 90,
                max: 200
            }
        }
    },
    hero: {
        jumpSpeed: 12,
        maxJumps: 2,
        position: {
            x: 350,
            y: 595
        },
		particlePosition: {
			x: 38,
			y: 80
		}
    },
    scenes: {
        "Game": GameScene
    }
};