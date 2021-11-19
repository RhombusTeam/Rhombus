import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs";

let PISTOL_DAMAGE = 0;

let backpack = ["book"];

if(backpack.includes("pistol")) {
    PISTOL_DAMAGE = 4;
}

updateToStorage(backpack);

kaboom({
    global: true,
    width: 1280,
    height: 720,
    debug: true,
    background: [50, 50, 50],
    scale: 1,
    font: "sink",
    canvas: document.querySelector("canvas"),
});

const SHOT_SPEED = 400;
const PLAYER_SPEED = 200;
const PLAYER_DAMAGE = 1 + PISTOL_DAMAGE;

loadSpriteAtlas("./sprites/48.png", {
    ghostBoss: {
        x: 0,
        y: 0,
        width: 384,
        height: 48,
        sliceX: 8,
        sliceY: 1, 
        anims: {
            default_s: {from: 0, to: 3, loop: true, speed: 10},
            default_w: {from: 4, to: 7, loop: true, speed: 10},
        }
    }
})

loadSpriteAtlas("./sprites/24.png", {
    player: {
        x: 0,
        y: 0,
        width: 240,
        height: 240,
        sliceX: 10,
        sliceY: 10,
        anims: {
            default_s: {from: 0, to: 0, loop: true},
            walk_s: {from: 0, to: 3, loop: true},

            default_w: {from: 4, to: 4, loop: true},
            walk_w: {from: 4, to: 7, loop: true},

            default_d: {from: 8, to: 8, loop: true},
            walk_d: {from: 8, to: 11, loop: true},

            default_a: {from: 12, to: 12, loop: true},
            walk_a: {from: 12, to: 15, loop: true},
        }
    },
    ghost: {
        x: 144,
        y: 24,
        width: 240,
        height: 240,
        sliceX: 10,
        sliceY: 10,
        anims: {
            default_a: {from: 1, to: 1, loop: true},
            default_d: {from: 0, to: 0, loop: true},
        }
    },

    heart: {
        x: 0,
        y: 48,
        width: 240,
        height: 240,
        sliceX: 10,
        sliceY: 10, 
        anims: {
            default: {from: 0, to: 0, loop: true},
            half: {from: 2, to: 2, loop: true},
            empty: {from: 1, to: 1, loop: true},
        }
    },

    arrowLeft: {
        x: 196,
        y: 24,
        width: 240,
        height: 240,
        sliceX: 10,
        sliceY: 10, 
    },
    sword: {
        x: 72,
        y: 48,
        width: 240,
        height: 240,
        sliceX: 10,
        sliceY: 10, 
    }
})

loadSpriteAtlas("./sprites/16.png", {
    breakingBlock: {
        x: 0,
        y: 0,
        width: 160,
        height: 160,
        sliceX: 10,
        sliceY: 10,
        anims: {
            hp3: {from: 1, to: 1, loop: true},
            hp2: {from: 2, to: 2, loop: true},
            hp1: {from: 3, to: 3, loop: true},
        }
    },
    questionBlock: {
        x: 144,
        y: 0,
        width: 160,
        height: 160,
        sliceX: 10,
        sliceY: 10,
    },
    alarmBlock: {
        x: 0,
        y: 16,
        width: 160,
        height: 160,
        sliceX: 10,
        sliceY: 10,
    },
    lineBlock: {
        x: 96,
        y: 0,
        width: 160,
        height: 160,
        sliceX: 10,
        sliceY: 10,
    },
    lineBlock2: {
        x: 16,
        y: 16,
        width: 160,
        height: 160,
        sliceX: 10,
        sliceY: 10,
    },
    bgBlock: {
        x: 64,
        y: 0,
        width: 160,
        height: 160,
        sliceX: 10,
        sliceY: 10,
    },
    weird: {
        x: 64,
        y: 0,
        width: 160,
        height: 160,
        sliceX: 10,
        sliceY: 10,
    },
    solid: {
        x: 80,
        y: 0,
        width: 160,
        height: 160,
        sliceX: 10,
        sliceY: 10,
    },
})

loadSprite("shot", "./sprites/shot.png")
loadSprite("logo", "./sprites/logo.png")

loadSound("click", "./sound/click.mp3");
loadSound("song", "./sound/menu_song.mp3");
loadSound("gameSong", "./sound/gameSound.mp3");
loadSound("splash", "./sound/splash.mp3");
loadSound("ghost", "./sound/ghost.mp3");
loadSound("rock", "./sound/rock.mp3");
loadSound("boss", "./sound/bossTheme.mp3");

let music = undefined;
let gameMusic = undefined;

let spawner = undefined;

let gbDir = undefined;

scene("main", (level) => {

    let direction = "s";
    let IsImmune = false;

    cursor("default");

    addLevel(rhombus ,{
        width: 16,
        height: 16,
        pos: vec2(0, 0),

        "-" : () => [
            sprite("lineBlock2"),
            rotate(45),
            scale(1.41),
            area(),
            solid(),
            z(2000),
            "wall",
        ],
        "=" : () => [
            sprite("lineBlock"),
            rotate(45),
            scale(1.41),
            area(),
            solid(),
            z(2000),
            "wall",
        ],
    });

    /*
    addLevel(background ,{
        width: 16,
        height: 16,
        pos: vec2(0, 0),
        "+" : () => [
            sprite("bgBlock"),
            z(1),
            "wall",
        ],
    });*/

    addLevel(levels[level], {
        width: 16,
        height: 16,
        pos: vec2(0, 0),

        "=" : () => [
            sprite("solid"),
            area(),
            solid(),
            "wall",
        ],

        "-" : () => [
            sprite("breakingBlock"),
            health(4),
            area(),
            solid(),
            z(1000),
            "wall",
            "hpwall",
        ],

        "%" : () => [
            sprite("weird"),
            z(1000),
            area(),
        ],

        "?" : () => [
            rect(16, 16),
            color([99]),
            health(3),
            area(),
            solid(),
            z(1000),
            "hoverwall",
        ],

        "@" : () => [
            sprite("player"),
            area(),
            solid(),
            scale(1.5),
            health(10),
            z(1005),
            "player",
        ],

        "!" : () => [
            rect(16, 16),
            area(),
            solid(),
            scale(1.5),
            health(5),
            "enemy",
        ],

        "#" : () => [
            sprite("ghost"),
            area(),
            scale(1.5),
            health(5),
            z(1001),
            "ghost",
        ],
        

        "$" : () => [
            sprite("ghostBoss"),
            area(),
            scale(1.5),
            health(25),
            z(1002),
            "boss",
            "ghostBoss",
        ],

        "&" : () => [
            sprite("questionBlock"),
            area(),
            solid(),
            z(1000),
            "door",
            "wall",
        ],

        "a": () => [
            sprite("alarmBlock"),
            area({offset: vec2(0, -20)}),
            solid(),
            z(2001),
            "wall",
            "pointA",
        ],

        "b": () => [
            sprite("alarmBlock"),
            area({offset: vec2(30, 0)}),
            solid(),
            z(2001),
            "wall",
            "pointB",
        ],
        
        "c": () => [
            sprite("alarmBlock"),
            area({offset: vec2(0, 20)}),
            solid(),
            z(2001),
            "wall",
            "pointC",
        ],

        "d": () => [
            sprite("alarmBlock"),
            area({offset: vec2(-20, 0)}),
            solid(),
            z(2001),
            "wall",
            "pointD",
        ],

        "o": () => [
            sprite("alarmBlock"),
            area({offset: vec2(0, 0)}),
            solid(),
            z(2001),
            "wall",
            "pointO",
        ],
        "e": () => [
            sprite("alarmBlock"),
            area({offset: vec2(0, 0)}),
            solid(),
            z(2001),
            "wall",
            "pointE",
        ],
    });

    let DOTS = ["pointA", "pointB", "pointC", "pointD", "pointO", "pointE"];

    let pointA = undefined;
    let pointB = undefined;
    let pointC = undefined;
    let pointD = undefined;
    let pointO = undefined;
    let pointE = undefined;
    DOTS.forEach((e) => {
        let point = e;
        if(levelData[level].hasOwnProperty(point)) {
            switch(point) {
                case "pointA":
                    pointA = get("pointA")[0];
                    break;
                case "pointB":
                    pointB = get("pointB")[0];
                    break; 
                case "pointC":
                    pointC = get("pointC")[0];
                    break;  
                case "pointD":
                    pointD = get("pointD")[0];
                    break;
                case "pointO":
                    pointO = get("pointO")[0];
                    break; 
                case "pointE":
                    pointE = get("pointE")[0];
                    break; 
            }
        }
    });

    const boss = get("boss")[0];
    const door = get("door")[0];
    const enemyes = get("enemy");
    const player = get("player")[0];
    const hpwalls = get("hpwall");
    const hoverwalls = get("hoverwall");
    let ghosts = get("ghost");
    const ghostBoss = get("ghostBoss")[0];

    music.stop();
    music.time(0);
    if(boss == undefined) {
        gameMusic = play("gameSong", {loop: true, volume: 0.2})
    }
    else {
        gameMusic = play("boss", {loop: true, volume: 0.2})
    }

    const btn = add([
		sprite("arrowLeft"),
		pos(90, 650),
		area({ cursor: "pointer", }),
		scale(4),
		origin("center"),
	])

	btn.onClick(() => {
        go("levels");
        play("click");
        gameMusic.stop();
        gameMusic.time(0);
        music = play("song", {loop: true, volume: 0.2})
    });

    onUpdate(() => cursor("default"));

    const heart1 = add([
        sprite("heart"),
        scale(2),
        pos(60, 50),
    ])

    const heart2 = add([
        sprite("heart"),
        scale(2),
        pos(90, 50),
    ])
    
    const heart3 = add([
        sprite("heart"),
        scale(2),
        pos(120, 50),
    ])
    
    const heart4 = add([
        sprite("heart"),
        scale(2),
        pos(150, 50),
    ])
    
    const heart5 = add([
        sprite("heart"),
        scale(2),
        pos(180, 50),
    ])

    let hpbar = undefined;

    if(boss != undefined) {
        hpbar = add([
            rect(8 * boss.hp(), 24),
            color(224, 33, 31),
            pos(1000, 70)
        ])
	add([
            text("Mother Ghost", {size: 18}),
            pos(1001, 100),
        ])
    } 

    if(boss != undefined) {
        boss.on("hurt", () => {
            destroy(hpbar);
            hpbar = add([
                rect(8 * boss.hp(), 24),
                color(224, 33, 31),
                pos(1000, 70),
            ])
        })
        function newGhost() {
            let ghost = add([
                sprite("ghost"),
                area(),
                pos(boss.pos.x, boss.pos.y),
                scale(1.5),
                health(5),
                z(1001),
                "ghost",
            ])
            ghost.action(() => {
                pathSearchGhost(player, ghost);
            })
    
            action(() => {
                if(player.isTouching(ghost)) {
                    if(!IsImmune) {
                        player.hurt(1);
                        IsImmune = true;
                        setTimeout(() => IsImmune = false, 500);
                    }
                }
            })

            ghost.on("death", () => {
                destroy(ghost);
                play("ghost", {volume: 0.5});
            });
        }
        spawner = setInterval(() => {
            newGhost();
        }, 3000);
    }
    
    

    player.collides("ghost", () => {
        if(!IsImmune) {
            IsImmune = true;
            player.hurt(1);
            setTimeout(() => IsImmune = false, 500);
        }
    });

    player.collides("enemy", () => {
        if(!IsImmune) {
            IsImmune = true;
            player.hurt(1);
            setTimeout(() => IsImmune = false, 500);
        }
    });
    
    player.collides("boss", () => {
        if(!IsImmune) {
            IsImmune = true;
            player.hurt(1);
            setTimeout(() => IsImmune = false, 500);
        }
    });

    player.on("death", () => {
        destroy(player);
        clearInterval(spawner);
        go("lose", level);
    })

    player.on("hurt", () => {
        switch(player.hp()) {
            case 9:
                heart5.play("half");
                break;
            case 8:
                heart5.play("empty");
                break;
            case 7:
                heart4.play("half");
                break;
            case 6:
                heart4.play("empty");
                break;
            case 5:
                heart3.play("half");
                break;
            case 3:
                heart3.play("empty");
                break;
            case 2:
                heart2.play("half");
                break;
            case 1:
                heart2.play("empty");
                break;
        }   
    })

    if(ghostBoss != undefined) {
        ghostBoss.on("death", () => {
            destroy(ghostBoss);
	    clearInterval(spawner);
        })
        if(player.isTouching(ghostBoss)) {
            if(!IsImmune) {
                player.hurt(1);
                IsImmune = true;
                setTimeout(() => IsImmune = false, 500);
            }
        }
        ghostBoss.action(() => {
            pathSearchGhost(player, ghostBoss, true);
        })
    }

    for(let hpwall of hpwalls) {
        hpwall.on("death", () => {
            destroy(hpwall);
            play("rock", {speed: 2});
        });  
        hpwall.on("hurt", () => {
            switch(hpwall.hp()) {
                case 3: hpwall.play("hp3"); break;
                case 2: hpwall.play("hp2"); break;
                case 1: hpwall.play("hp1"); break;
            }
        })   
    }

    for(let hoverwall of hoverwalls) {
        hoverwall.on("death", () => {
            hoverwall.solid = false;
            hoverwall.color = [180, 0 , 33];
        });
    }

    for(let i = 0; i < PLAYER_DAMAGE; i++) {
        add([
            sprite("sword"),
            pos(70, 100),
        ])
    }

    for(let i = 0; i < ghosts.length; i++) {
        let ghost = ghosts[i];
        ghost.on("death", () => {
            destroy(ghost);
            play("ghost", {volume: 0.5});
        });

        ghost.action(() => {
            pathSearchGhost(player, ghost);
        })

        action(() => {
            if(player.isTouching(ghost)) {
                if(!IsImmune) {
                    player.hurt(1);
                    IsImmune = true;
                    setTimeout(() => IsImmune = false, 500);
                }
            }
        })
    }

    for(let i = 0; i < enemyes.length; i++) {
        let enemy = enemyes[i];
        enemy.on("death", () => destroy(enemy));
        let isCollidingEnemy = false;
        let isCollidingWall = false;
        let collidedWall = null;

        enemy.collides("enemy", () => {
            isCollidingEnemy = true;
        })

        enemy.collides("wall", (wall) => {
            isCollidingWall = true;
            collidedWall = wall;
        })

        enemy.action(() => {
            if(isCollidingWall) {
                pathSearchAroundWall(enemy, collidedWall, player);
                isCollidingWall = false;
            }
            else if(isCollidingEnemy) {
                pathSearchPythagoras(enemy, player);
                isCollidingEnemy = false;
            }
            else if(!isCollidingWall) {
                pathSearchDeafault(player, enemy);
            }
            else {
                enemy.move(Math.random() * -110, Math.random() * -110)
            }
        })
            

    }

    keyPress("space", () => {
        
        if(player.isTouching(door)) {
            const d = addDialog();
            const enter = levelData[level].question + "? ";
            d.say("Enter result: ");
            let input = "";
            onCharInput((ch) => {
                input += "" + ch;
                d.say(enter + "" + input);
            });
            keyPress("enter", () => {
                if(input.trim() == levelData[level].correct) {
                    go("win", level);
                }
                else {
                    d.destroy();
                }
            });
            keyPress("backspace", () => {
                input = input.slice(0, input.length - 1);
                d.say(enter + "" + input);
            });
            for (const dir in dirs) {
                keyPress(dir, () => {
                    d.destroy();
                });
            }
        }
        else if(pointA != undefined && player.isTouching(pointA)) {
            add([
                text("A(" + levelData[level].pointA  + ")", {size: 18}),
                pos(pointA.pos.x - 30, pointA.pos.y),
                z(4000),
            ]);
        }
        else if(pointB != undefined && player.isTouching(pointB)) {
            add([
                text("B(" + levelData[level].pointB + ")", {size: 18}),
                pos(pointB.pos.x, pointB.pos.y),
                z(4000),
            ])
        }
        else if(pointC != undefined && player.isTouching(pointC)) {
            add([
                text("C(" + levelData[level].pointC + ")", {size: 18}),
                pos(pointC.pos.x - 30, pointC.pos.y),
                z(4000),
            ])
        }
        else if(pointD != undefined && player.isTouching(pointD)) {
            add([
                text("D(" + levelData[level].pointD + ")", {size: 18}),
                pos(pointD.pos.x, pointD.pos.y),
                z(4000),
            ])
        }
        else if(pointE != undefined && player.isTouching(pointE)) {
            add([
                text("E(" + levelData[level].pointE + ")", {size: 18}),
                pos(pointE.pos.x, pointE.pos.y),
                z(4000),
            ])
        }
        else if(pointO != undefined && player.isTouching(pointO)) {
            add([
                text("O(" + levelData[level].pointO + ")", {size: 18}),
                pos(pointO.pos.x - 12, pointO.pos.y),
                z(4000),
            ])
        }
        else {
            let shot = "";
            switch(direction) {
                case "d":
                    shot = add([
                        area(),
                        sprite("shot"),
                        z(1001),
                        pos(player.pos.x + player.width, player.pos.y + player.height - 8),
                        "shot",
                    ]);
                    shot.action(() => {
                        shot.move(SHOT_SPEED, 0);
                    });
                    break;
                case "a":
                    shot = add([
                        area(),
                        sprite("shot"),
                        z(1001),
                        pos(player.pos.x, player.pos.y + player.height - 8),
                        "shot",
                    ]);
                    shot.action(() => {
                        shot.move(-SHOT_SPEED, 0);
                    });
                    break;
                case "w":
                    shot = add([
                        area(),
                        sprite("shot"),
                        z(1001),
                        pos(player.pos.x + player.width - 8, player.pos.y),
                        "shot",
                    ]);
                    shot.action(() => {
                        shot.move(0, -SHOT_SPEED);
                    });
                    break;
                case "s":
                    shot = add([
                        area(),
                        sprite("shot"),
                        z(1001),
                        pos(player.pos.x + player.width - 8, player.pos.y + player.height),
                        "shot",
                    ]);
                    shot.action(() => {
                        shot.move(0, SHOT_SPEED);
                    });
                    break;
            }
            shot.collides("wall", () => {
                destroy(shot);
            });
            shot.collides("hpwall", (wall) => {
                wall.hurt(PLAYER_DAMAGE);
            });
            shot.collides("hoverwall", (wall) => {
                if(wall.hp() < 1) {
                }
                else {
                    wall.hurt(PLAYER_DAMAGE);
                    destroy(shot);
                }
            });
            shot.collides("enemy", (e) => {
                e.hurt(PLAYER_DAMAGE);
                destroy(shot);
            });
            shot.collides("ghost", (e) => {
                e.hurt(PLAYER_DAMAGE);
                destroy(shot);
            });
            shot.collides("ghostBoss", (e) => {
                e.hurt(PLAYER_DAMAGE);
                destroy(shot);
            });
                
        }
    });

    for (const dir in dirs) {
        keyDown(dir, () => {
            player.move(dirs[dir].scale(PLAYER_SPEED));
            direction = dir;
        });
        keyPress(dir, () => {
            player.play("walk_" + direction);
        });
        onKeyRelease(dir, () => {
            if (
                !isKeyDown("w")
                && !isKeyDown("a")
                && !isKeyDown("s")
                && !isKeyDown("d")
            ) {
                player.play("default_" + direction);
            }
        })
    }

});


scene("menu", () => {

    addLevel(menubg, {
        width: 64,
        height: 64,
        pos: vec2(0, 0),

        "-" : () => [
            sprite("lineBlock2"),
            scale(4),
            area(),
            solid(),
            "wall",
        ],
        "=" : () => [
            sprite("lineBlock"),
            area(),
            solid(),
            scale(4),
            "wall",
        ],
        
        "@" : () => [
            sprite("player"),
            area(),
            solid(),
            scale(6),
            z(1005),
            "player",
        ],

        "#" : () => [
            sprite("ghost"),
            area(),
            scale(6),
            z(1001),
            "ghost",
        ],
        

        "$" : () => [
            sprite("ghostBoss"),
            area(),
            scale(6),
            health(25),
            z(1002),
            "boss",
            "ghostBoss",
        ],

        "&" : () => [
            sprite("questionBlock"),
            area(),
            scale(4),
            solid(),
            z(1000),
            "door",
            "wall",
        ],

        "a": () => [
            sprite("alarmBlock"),
            area({offset: vec2(0, -20)}),
            solid(),
            scale(4),
            z(2001),
            "wall",
            "pointA",
        ],

    })

    add([
        pos(vec2(width() / 2 - 150 , 120)),
        rect(300, 150),
        color(0,0,0),
        outline(5, WHITE),
    ])
    const btn = add([
        pos(vec2(width() / 2 - 150 , 120)),
        sprite("logo"),
    ])

    addButton("Play", vec2(width() / 2, 350), 3, () => {go("levels"); play("click")});
    addButton("Backpack", vec2(width() / 2, 420), 3, () => {go("backpack");play("click")});
    addButton("Quit", vec2(width() / 2, 490), 3, () => play("click"));

    onUpdate(() => cursor("default"));
});


scene("levels", (page) => {
    for(let i = 0; i < levels.length; i++) {
        if(i < 5) {
            addLevelBox(i + 1, vec2(330 + 130 * i, 240), 3, () => {go("main", i);play("click")});
        }
        else {
            addLevelBox(i + 1, vec2(330 + 130 * (i - 5), 370), 3, () => {go("main", i);play("click")});
        }
    }

    addLevel(levelbg, {
        width: 64,
        height: 64,
        pos: vec2(0, 0),

        "-" : () => [
            sprite("lineBlock2"),
            scale(4),
            area(),
            solid(),
            "wall",
        ],
        "=" : () => [
            sprite("lineBlock"),
            area(),
            solid(),
            scale(4),
            "wall",
        ],
    })

    const btn = add([
		sprite("arrowLeft"),
		pos(90, 650),
		area({ cursor: "pointer", }),
		scale(4),
		origin("center"),
	])

	btn.onClick(() => {go("menu");play("click")});

    onUpdate(() => cursor("default"));
});

scene("win", (current) => {
    gameMusic.stop();
    gameMusic.time(0);
    music.play();
    addLevel(levelbg, {
        width: 64,
        height: 64,
        pos: vec2(0, 0),

        "-" : () => [
            sprite("lineBlock2"),
            scale(4),
            area(),
            solid(),
            "wall",
        ],
        "=" : () => [
            sprite("lineBlock"),
            area(),
            solid(),
            scale(4),
            "wall",
        ],
    })
    add([
        text("You Won!"),
        scale(5),
        pos(vec2(width() / 2 - 110, 180))
    ])
    addButton("Again", vec2(width() / 2, 300), 3, () => {
        go("main", current);
        music.stop();
        music.time(0);
    });
    addButton("Menu", vec2(width() / 2, 370), 3, () => go("menu"));
    if(levels.length > current + 1) {
        addButton("Next",vec2(width() / 2, 440), 3, () => go("main", current + 1));
    }

    onUpdate(() => cursor("default"));
});

scene("lose", (current) => {
    gameMusic.stop();
    gameMusic.time(0);
    music.play();
    addLevel(levelbg, {
        width: 64,
        height: 64,
        pos: vec2(0, 0),

        "-" : () => [
            sprite("lineBlock2"),
            scale(4),
            area(),
            solid(),
            "wall",
        ],
        "=" : () => [
            sprite("lineBlock"),
            area(),
            solid(),
            scale(4),
            "wall",
        ],
    })
    add([
        text("You Lost!"),
        scale(5),
        pos(vec2(width() / 2 - 130, 200))
    ])
    addButton("Again", vec2(width() / 2, 370), 3, () => {
        go("main", current);
        music.stop();
        music.time(0);
    });
    addButton("Menu", vec2(width() / 2, 440), 3, () => go("menu"));

    onUpdate(() => cursor("default"));
});

scene("start", () => {
    addLevel(levelbg, {
        width: 64,
        height: 64,
        pos: vec2(0, 0),

        "-" : () => [
            sprite("lineBlock2"),
            scale(4),
            area(),
            solid(),
            "wall",
        ],
        "=" : () => [
            sprite("lineBlock"),
            area(),
            solid(),
            scale(4),
            "wall",
        ],
    })
    addButton("Start", vec2(width() / 2, 300), 3, () => {go("menu");play("click"); music = play("song", {loop: true, volume: 0.2})});

    onUpdate(() => cursor("default"));
});


scene("backpack", (items) => {
    for(let i = 0; i < backpack.length; i++) {
        let item = backpack[i];
        add([
            text(item),
            //size(48),
            pos(width() / 2, 300 + i * 70),
            area(),
            scale(4),
            origin("center"),
        ])
    }
    addLevel(levelbg, {
        width: 64,
        height: 64,
        pos: vec2(0, 0),

        "-" : () => [
            sprite("lineBlock2"),
            scale(4),
            area(),
            solid(),
            "wall",
        ],
        "=" : () => [
            sprite("lineBlock"),
            area(),
            solid(),
            scale(4),
            "wall",
        ],
    })

    const btn = add([
		sprite("arrowLeft"),
		pos(90, 650),
		area({ cursor: "pointer", }),
		scale(4),
		origin("center"),
	])

	btn.onClick(() => {go("menu");play("click")});

    onUpdate(() => cursor("default"));
});

function pathSearchAroundWall(searcher, wall, target) {
    let wall_x = wall.pos.x;
    let wall_y = wall.pos.y;
    let searcher_x = searcher.pos.x;
    let searcher_y = searcher.pos.y;

    if(wall_x > searcher_x && wall_y > searcher_y) {
        if(searcher_x - wall_x > searcher_y - wall_y) {
            searcher.move(-200, 0);
        }
        else {
            searcher.move(0, 200); 
        }
        
    }
    else if(wall_x < searcher_x && wall_y < searcher_y) {
        if(searcher_x - wall_x > searcher_y - wall_y) {
            searcher.move(0, -200);
        }
        else {
            searcher.move(200, 0); 
        }
    }
    else if(wall_x > searcher_x && wall_y < searcher_y) {
        if(wall_x - searcher_x > searcher_y - wall_y) {
            if(wall_x - searcher_x != Math.round(wall_x - searcher_x)) {
                searcher.move(200, 0); 
            }
            else {
                searcher.move(0, 200);
            }
        }
        else {
            searcher.move(200, 0);
        }
    }
    else if(wall_x < searcher_x && wall_y > searcher_y) {
        if(wall_x - searcher_x > searcher_y - wall_y) {
            if(searcher_x - wall_x != Math.round(searcher_x - wall_x)) {
                searcher.move(-200, 0); 
            }
            else {
                searcher.move(0, -200); 
            }
        }
        else {
            searcher.move(0, -200); 
        }
    }
}

function pathSearchPythagoras(searcher, target) {
    let searcher_x = searcher.pos.x;
    let searcher_y = searcher.pos.y;
    let target_x = target.pos.x;
    let target_y = target.pos.y;

    if(searcher_x > target_x && searcher_y > target_y) {
        if(searcher_x - target_x > searcher_y - target_y) {
            searcher.move(-155, 0);
        }
        else {
            searcher.move(0, -155);
        }
    }
    else if(searcher_x < target_x && searcher_y < target_y) {
        if(target_x - searcher_x > target_y - searcher_y) {
            searcher.move(155, 0);
        }
        else {
            searcher.move(0, 155);
        }
    }
    else if(searcher_x > target_x && searcher_y < target_y) {
        if(searcher_x - target_x > target_y - searcher_y) {
            searcher.move(-155, 0);
        }
        else {
            searcher.move(0, 155);
        }
    }
    else if(searcher_x < target_x && searcher_y > target_y) {
        if(target_x - searcher_x > searcher_y - target_y) {
            searcher.move(155, 0);
        }
        else {
            searcher.move(0, -155);
        }
    }
}

function pathSearchDeafault(player, enemy) {
    if(player.pos.x > enemy.pos.x && player.pos.y > enemy.pos.y) {
        enemy.move(110, 110);
    }
    else if(player.pos.x < enemy.pos.x && player.pos.y > enemy.pos.y) {
        enemy.move(-110, 110);
    }
    else if(player.pos.x < enemy.pos.x && player.pos.y < enemy.pos.y) {
        enemy.move(-110, -110);
    }
    else if(player.pos.x > enemy.pos.x && player.pos.y < enemy.pos.y) {
        enemy.move(110, -110);
    }
    else if(player.pos.x == enemy.pos.x && player.pos.y < enemy.pos.y) {
        enemy.move(0, -155);
    }
    else if(player.pos.x == enemy.pos.x && player.pos.y > enemy.pos.y) {
        enemy.move(0, 155);
    }
    else if(player.pos.x < enemy.pos.x && player.pos.y == enemy.pos.y) {
        enemy.move(-155, 0);
    }
    else if(player.pos.x > enemy.pos.x && player.pos.y == enemy.pos.y) {
        enemy.move(155, 0);
    }
}

function pathSearchGhost(player, enemy, ghostBoss) {
    if(player.pos.x > enemy.pos.x && player.pos.y > enemy.pos.y) {
        enemy.move(110, 110);
        if(ghostBoss == undefined) {
            enemy.play("default_d");
        }
        else if(gbDir != "default_s") {
            enemy.play("default_s");
            gbDir = "default_s";
        }
    }
    else if(player.pos.x < enemy.pos.x && player.pos.y > enemy.pos.y) {
        enemy.move(-110, 110);
        if(ghostBoss == undefined) {
            enemy.play("default_a");
        }
        else if(gbDir != "default_s") {
            enemy.play("default_s");
            gbDir = "default_s";
        }
    }
    else if(player.pos.x < enemy.pos.x && player.pos.y < enemy.pos.y) {
        enemy.move(-110, -110);
        if(ghostBoss == undefined) {
            enemy.play("default_a");
        }
        else if(gbDir != "default_w") {
            enemy.play("default_w");
            gbDir = "default_w";
        }
    }
    else if(player.pos.x > enemy.pos.x && player.pos.y < enemy.pos.y) {
        enemy.move(110, -110);
        if(ghostBoss == undefined) {
            enemy.play("default_d");
        }
        else if(gbDir != "default_w") {
            enemy.play("default_w");
            gbDir = "default_w";
        }
    }
    else if(player.pos.x == enemy.pos.x && player.pos.y < enemy.pos.y) {
        enemy.move(0, -155);
        if(ghostBoss != undefined && gbDir != "deafult_w") {
            enemy.play("deafult_w");
            gbDir = "deafult_w";
        }
    }
    else if(player.pos.x == enemy.pos.x && player.pos.y > enemy.pos.y) {
        enemy.move(0, 155);
        if(ghostBoss != undefined && gbDir != "deafult_s") {
            enemy.play("deafult_s");
            gbDir = "deafult_s";
        }
    }
    else if(player.pos.x < enemy.pos.x && player.pos.y == enemy.pos.y) {
        enemy.move(-155, 0);
        if(ghostBoss == undefined) {
            enemy.play("default_a");
        }
    }
    else if(player.pos.x > enemy.pos.x && player.pos.y == enemy.pos.y) {
        enemy.move(155, 0);
        if(ghostBoss == undefined) {
            enemy.play("default_d");
        }
    }
}

function addButton(txt, p, scl, fn) {

	const btn = add([
		text(txt),
		pos(p),
		area({ cursor: "pointer", }),
		scale(1),
		origin("center"),
	])

	btn.onClick(fn);

	btn.onUpdate(() => {
		if (btn.isHovering()) {
			const t = time() * 10;
			btn.color = rgb(255, 255, 255);
			btn.scale = vec2(scl * 1.2)
		} else {
			btn.scale = vec2(scl);
			btn.color = rgb();
		}
	})

}

function addLevelBox(txt, p, scl, fn) {
    const box = add([
        rect(100, 100),
        color(0, 0, 0),
        outline(5, WHITE),
        pos(p),
    ])
    const btn = add([
		text(txt, {
            size: 7,
        }),
		pos(p.x + box.width / 2, p.y + box.height / 2),
		area({ cursor: "pointer", }),
		scale(1),
		origin("center"),
	])

	btn.onClick(fn);

	btn.onUpdate(() => {
		if (btn.isHovering()) {
			const t = time() * 10;
			btn.color = rgb(255, 255, 255);
			btn.scale = vec2(scl * 1.2)
		} else {
			btn.scale = vec2(scl);
			btn.color = rgb();
		}
	})
}

function addDialog() {
    const h = 160
    const pad = 48
    const bg = add([
        pos(20, height() - h - 20),
        rect(width() - 40, h),
        color(0, 0, 0),
        z(5000),
        outline(10, WHITE),
    ])
    const txt = add([
        text("", {
            width: width(),
            size: 24,
            color: (255, 255, 255)
        }),
        pos(0 + pad, height() - h + pad),
        z(5000),
    ])
    bg.hidden = true
    txt.hidden = true
    return {
        say(t) {
            txt.text = t
            bg.hidden = false
            txt.hidden = false
        },
        dismiss() {
            if (!this.active()) {
                return
            }
            txt.text = ""
            bg.hidden = true
            txt.hidden = true
        },
        active() {
            return !bg.hidden
        },
        destroy() {
            destroy(bg)
            destroy(txt);
        },
    }
}

function updateToStorage(arr) {
    let items = [];
    for(let item of arr) {
        items.push(item);
    }
    localStorage.setItem("items", items);
}

const dirs = {
    "a": LEFT,
    "d": RIGHT,
    "w": UP,
    "s": DOWN,
};

const levelData = [
    {
        question: "What is the length of this rhombus perimeter if AB = 7.03",
        correct: "28.12",
        pointA: "unknown",
        pointB: "unknown",
        pointC: "unknown",
        pointD: "unknown",
    },
    {
        question: "If the perimeter of the rhombus is 24 what is the length of AB",
        correct: "6",
        pointA: "unknown",
        pointB: "unknown",
        pointC: "unknown",
        pointD: "unknown",
    },
    {
        question: "What is the length of BO if BD is 18",
        correct: "9",
        pointA: "unknown",
        pointB: "unknown",
        pointC: "unknown",
        pointD: "unknown",
        pointO: "unknown",
    },
    {
        question: "What is the length of CB if AC is 12 and BD is 16",
        correct: "10",
        pointA: "unknown",
        pointB: "unknown",
        pointC: "unknown",
        pointD: "unknown",
        pointO: "unknown",
    },
    {
        question: "What is the length of BD if AC is 8 and BC is 5",
        correct: "6",
        pointA: "unknown",
        pointB: "unknown",
        pointC: "unknown",
        pointD: "unknown",
        pointO: "unknown",
    },
    
    {
        question: "How many degrees is B",
        correct: "144",
        pointA: "unknown",
        pointB: "unknown",
        pointC: "36 degrees",
        pointD: "unknown",
    },
    
    {
        question: "How many degrees is B if AC = BD",
        correct: "90",
        pointA: "unknown",
        pointB: "unknown",
        pointC: "unknown",
        pointD: "unknown",
        pointO: "unknown",
    },
    
    {
        question: "How many degrees is CEO if EB = OD",
        correct: "54",
        pointA: "unknown",
        pointB: "unknown",
        pointC: "unknown",
        pointD: "72 degrees",
        pointO: '',
        pointE: '',
    },
    {
        question: "How many degrees is CBE if EBD is 60.5 degrees",
        correct: "20",
        pointA: "unknown",
        pointB: "unknown",
        pointC: "29 degrees",
        pointD: "unknown",
        pointE: "unknown",
        pointO: "unknown",
    },
    {
        question: "What is the length of DA if CE is 11 and BD = CD",
        correct: "22",
        pointA: "52 degrees",
        pointB: "CBE is 32 degrees",
        pointC: "unknown",
        pointD: "unknown",
        pointE: "unknown",
        pointO: "unknown",
    },
]

//height: 45, width: 80
const levels = [
    [
        "                                                                                ",
        "                                       c                                        ",
        "                                                                                ", 
        "                                                                                ",  
        "                                                                                ", 
        "                                                                                ", 
        "                                                                                ", 
        "                                                                                ", 
        "                                                                                ", 
        "                                                                                ",
        "                                                                                ",
        "                                                                                ", 
        "                                                                                ",  
        "                                                                                ", 
        "                                         -         #                            ", 
        "                                                                                ", 
        "                                         -  @                                   ", 
        "#                                                                              #", 
        "                                         -         #                            ",
        "                              &                                                 ",
        "                                                                                ", 
        "                                                                                ",  
        "                  b                                         d                   ", 
        "                                                                                ", 
        "                                                                                ", 
        "                                                                                ", 
        "                                                                                ", 
        "                                                                                ",
        "                                                                                ",
        "                                                                                ", 
        "                                                                                ",  
        "                                                                                ", 
        "                                                                                ", 
        "                                                                                ", 
        "                                                                                ", 
        "                                                                                ", 
        "                                                                                ",
        "                                                                                ",
        "                                                                                ", 
        "                                                                                ",  
        "                                                                                ", 
        "                                                                                ", 
        "                                                                                ", 
        "                                       a                                        ", 
        "                                                                                ",
    ],
    
        [
            "                                                                                ",
            "                                       c                                        ",
            "                                                                                ", 
            "                                                                                ",  
            "                                      @                                         ", 
            "                                                                     #          ", 
            "                                 -------------                                  ", 
            "                                                                                ", 
            "                                                                                ", 
            "                                                                                ",
            "                                                                                ",
            "                                                                                ", 
            "                                                                                ",  
            "                                                                                ", 
            "                                                                                ", 
            "                                                                                ", 
            "                                                                                ", 
            "                           ======                                               ", 
            "                          %      ====                                           ",
            "                          %   &  ====                                           ",
            "                          %      ====                                           ", 
            "                           ======                                               ",  
            "                  b-----------------------------------------d                   ", 
            "                                                                                ", 
            "                                                                                ", 
            "                                                                                ", 
            "                                                                                ", 
            "                                                                                ",
            "                                                                                ",
            "                                                                                ", 
            "                                                                                ",  
            "                                                                                ", 
            "                                                                                ", 
            "                                                                                ", 
            "                                         #                                      ", 
            "                                                                                ", 
            "                                                                                ",
            "                                                                                ",
            "                                                                                ", 
            "                                                                                ",  
            "                                           #                                    ", 
            "   #                                                                            ", 
            "                                                                                ", 
            "                                       a                                        ", 
            "                                                                                ",
        ],
        [
            "                                                                                ",
            "                                       c                                        ",
            "                                       %                                        ", 
            "                                       %                                        ",  
            "                                       %                                        ", 
            "                                       %                                        ", 
            "                                       %                                        ", 
            "                                       %                                        ", 
            "                                       %                                        ", 
            "                                       %                                        ",
            "                                       %                                        ",
            "                                       %                                        ", 
            "                                       %                                        ",  
            "                                       %                                        ", 
            "                                       %                                        ", 
            "                                       % -     -     #                          ", 
            "                                       % -  @  -                                ", 
            "                         #             % -     -     #                          ", 
            "                             -         % -                                      ",
            "                         #   -&        % -                                      ",
            "                             -         % -                                      ", 
            "                         #             %                                        ",  
            "                  b%%%%%%%%%%%%%%%%%%%%o%%%%%%%%%%%%%%%%%%%%d                   ", 
            "                                       %                                        ", 
            "                                       %                                        ", 
            "                                       %                                        ", 
            "                                       %                                        ", 
            "                                       %                                        ",
            "                                       %                                        ",
            "                                       %                                        ", 
            "                                       %                                        ",  
            "                                       %                                        ", 
            "                                       %                                        ", 
            "                                       %                                        ", 
            "                                       %                                        ", 
            "                                       %                                        ", 
            "                                       %                                        ",
            "                                       %                                        ",
            "                                       %                                        ", 
            "                                       %                                        ",  
            "                                       %                                        ", 
            "                                       %                                        ", 
            "                                       % #                                      ", 
            "                                       a                                        ", 
            "                                                                                ",  
        ],
    
    [
        "                                                                                ",
        "                                       c                                        ",
        "                                       %-                                       ", 
        "                                       %-                                       ",  
        "                                       %-                                       ", 
        "                                       %-                                       ", 
        "                                       %-                                       ", 
        "                                       %-                                       ", 
        "                                       %-                                       ", 
        "                                       %-                                       ",
        "                                       %-                                       ",
        "                                       %-                                       ", 
        "                                       %-                                       ",  
        "                         #             %-                                       ", 
        "                                       %-                                       ", 
        "                         #             %-                                       ", 
        "                                       %-   @                                   ", 
        "                         #  -----      %-                                       ", 
        "                            -   -      %-                                       ",
        "                         #  - & -      %-                                       ",
        "                            -   -      %-                                       ", 
        "                         #  -----      %--------------------                    ",  
        "                  b%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%d                   ", 
        "                                       %                                        ", 
        "                                       %                                        ", 
        "                                       %                                        ", 
        "                                       %                                        ", 
        "                                       %                                        ",
        "                                       %                                        ",
        "                                       %                                        ", 
        "                                       %                                        ",  
        "                                       %                                        ", 
        "                                       %                                        ", 
        "                                       %                                        ", 
        "                                       %                                        ", 
        "                                       %                                        ", 
        "                                       %                                        ",
        "                                       %                                        ",
        "                                       %                                        ", 
        "                                       %                                        ",  
        "                                       %                                        ", 
        "                                       %                                        ", 
        "                                       %                                        ", 
        "                                       a                                        ", 
        "                                                                                ",  
    ],
    [
        "                                                                                ",
        "                                       c                                        ",
        "                                       %                                        ", 
        "                                       %                                        ",  
        "                                       %                                        ", 
        "                                       %                                        ", 
        "                                       %                                        ", 
        "                                       %                                        ", 
        "                                       %                                        ", 
        "                                       %                                        ",
        "                                       %                                        ",
        "                                       %                                        ", 
        "                                       %                                        ",  
        "                                       %                                        ", 
        "                                      -%------- -                               ", 
        "                                      -%        -                               ", 
        "                                      -%   @    -                               ", 
        "                                       %                                        ", 
        "                                       %                                        ",
        "                              &        %                                        ",
        "                   --                  %                                        ", 
        "                    ---                % #    #                                 ",  
        "                  b%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%d                   ", 
        "                    ---                %                                        ", 
        "                   --                  %                                        ", 
        "                                       %                                        ", 
        "                                       %                                        ", 
        "                                       %                                        ",
        "                                       %                                        ",
        "                                       %                                        ", 
        "                                       %                                        ",  
        "                                       %                                        ", 
        "                                       %                                        ", 
        "                                       %                                        ", 
        "                                       %                                        ", 
        "                                       %                                        ", 
        "                                       %                                        ",
        "                                       %                                        ",
        "                                       %                                        ", 
        "                                      -%-                                       ",  
        "                                      -%-                                       ", 
        "                                     --%--                                      ", 
        "                                     - % -                                      ", 
        "                                       a                                        ", 
        "                                                                                ",
    ],
    
    [
        "                                                                                ",
        "                                       c                                        ",
        "                                                                                ", 
        "                                      # #                                       ",  
        "                                    -------                                     ", 
        "                                   ---------                                    ", 
        "                                                                                ", 
        "                                                                                ", 
        "                                                                                ", 
        "                                                                                ",
        "                                                                                ",
        "                                                                                ", 
        "                                                                                ",  
        "                                                                                ", 
        "                                         -----                                  ", 
        "                                         -                                      ", 
        "                                         -  @                                   ", 
        "                                         -                                      ", 
        "                                         -----                                  ",
        "                              &                                                 ",
        "                                                                                ", 
        "                                                                                ",  
        "                  b#                                       #d                   ", 
        "                                                                                ", 
        "                                                                                ", 
        "                                                                                ", 
        "                                                                                ", 
        "                                      =                                         ",
        "                                     = =                                        ",
        "                          ----------=   =------------                           ", 
        "                                     = =                                        ",  
        "                                      =                                         ", 
        "                                                                                ", 
        "                                                                                ", 
        "                                                                                ", 
        "                                                                                ", 
        "                                                                                ",
        "                                                                                ",
        "                                                                                ", 
        "                                                                                ",  
        "                                                                                ", 
        "                                                                                ", 
        "                                                                                ", 
        "                                       a                                        ", 
        "                                                                                ",
    ],
    
    [
        "                                                                                ",
        "                                       c                                        ",
        "                                       %                                        ", 
        "                                       %                                        ",  
        "                                       %                                        ", 
        "                                       %                                        ", 
        "                                       %   #                                    ", 
        "                                       %                                        ", 
        "                                       %   #                                    ", 
        "                                       %                                        ",
        "                                       %                                        ",
        "                                       %                                        ", 
        "                                       %                                        ",  
        "                                       %                                        ", 
        "                                       %                                        ", 
        "                          ========     %  ---                                   ", 
        "                          =      =     %   @                                    ", 
        "                          =      =     %                                        ", 
        "                          =      =     %  ---                                   ",
        "                          =   &  =    #%       #                                ",
        "                          --------     %                                        ", 
        "                                       %                                        ",  
        "                  b%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%d                   ", 
        "                                       %                                        ", 
        "                                       %                                        ", 
        "                                       %                                        ", 
        "                                       %                                        ", 
        "                                       %                                        ",
        "                                       %                                        ",
        "                                       %                                        ", 
        "                                       %                                        ",  
        "                                       %                                        ", 
        "                                       %                                        ", 
        "                                       %                                        ", 
        "                                       %                                        ", 
        "                                       %                                        ", 
        "                                       %                                        ",
        "                                       %                                        ",
        "                                       %                                        ", 
        "                                       %                                        ",  
        "                                       %                                        ", 
        "                                       %                                        ", 
        "                                       %                                        ", 
        "                                       a                                        ", 
        "                                                                                ",  
    ],
    
    [
        "                                                                                ",
        "                                       c                                        ",
        "                                      #                                         ", 
        "                                                                                ",  
        "                                                                                ", 
        "                                   o%%%%%%%e                                    ", 
        "                                                                                ", 
        "                                      #                                         ", 
        "                                                                                ", 
        "                                                                                ",
        "                                                                                ",
        "                                                                                ", 
        "                                                                                ",  
        "                                                                                ", 
        "                                                                                ", 
        "                                                                                ", 
        "                                                                                ", 
        "                                                                                ", 
        "                                                                                ",
        "                                                                                ",
        "                                                                                ", 
        "                                                                                ",  
        "                  b                   #                     d                   ", 
        "                          &                                                     ", 
        "                                                                                ", 
        "                                                                                ", 
        "                                   #     #                                      ", 
        "                                                                                ",
        "                                                                                ",
        "                                                                                ", 
        "                                                                                ",  
        "                                                                                ", 
        "                                                                                ", 
        "                                                                                ", 
        "                                                                                ", 
        "                                                                                ", 
        "                                                                                ",
        "                                                                                ",
        "                                 ------------                                   ", 
        "                                                                                ",  
        "                                       @                                        ", 
        "                                                                                ", 
        "                                                                                ", 
        "                                       a                                        ", 
        "                                                                                ",
    ],
    [
        "                                                                                ",
        "                                       c                                        ",
        "                                                                                ", 
        "                                                                                ",  
        "                                           e                                    ", 
        "                                                                                ", 
        "                                                                                ", 
        "                                                                                ", 
        "                                                                                ", 
        "                                                                                ",
        "                                          #                                     ",
        "                                                                                ", 
        "                                                                                ",  
        "                                                                                ", 
        "                                                                                ", 
        "                                                                                ", 
        "                                                                                ", 
        "                                                                                ", 
        "                                                                                ",
        "                                                                                ",
        "                                                                                ", 
        "                                                                                ",  
        "                  b%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%d                   ", 
        "                          &            -                                        ", 
        "                                       -                                        ", 
        "                                       -                                        ", 
        "                                       -                                        ", 
        "                        -------------------------------                         ",
        "                                       -                                        ",
        "                                       -                                        ", 
        "                                       -                                        ",  
        "                                       -                                        ", 
        "                                       -                                        ", 
        "                                       -                                        ", 
        "                                       -                                        ", 
        "                                       -                                        ", 
        "                                       -                                        ",
        "                                       -                                        ",
        "                                 ------------                                   ", 
        "                                                                                ",  
        "                                       @                               #        ", 
        "                                                                                ", 
        "                                                                                ", 
        "                                       a                                        ", 
        "                                                                                ",
    ],
    [
        "                                                                                ",
        "                                       c                                        ",
        "                                                                                ", 
        "                                                                                ",  
        "                                                                                ", 
        "                                                                                ", 
        "                                                                                ", 
        "                                                                                ", 
        "                                                                                ", 
        "                                                                                ",
        "                                                                                ",
        "                                                  e                             ", 
        "                                                                                ",  
        "                                                                                ", 
        "                                                                                ", 
        "                                                                                ", 
        "                                            @                                   ", 
        "                                                                                ", 
        "                         &                                                      ",
        "                                                                                ",
        "                                                                                ", 
        "                                                                                ",  
        "                  b                                         d                   ", 
        "                                                                                ", 
        "                                                                                ", 
        "                                                                                ", 
        "                                                                                ", 
        "                                                                                ",
        "                                                                                ",
        "                                                                                ", 
        "                                                                                ",  
        "                                                                                ", 
        "                                                                                ", 
        "                                  $                                             ", 
        "                                                                                ", 
        "                                                                                ", 
        "                                                                                ",
        "                                                                                ",
        "                                                                                ", 
        "                                                                                ",  
        "                                                                                ", 
        "                                                                                ", 
        "                                                                                ", 
        "                                       a                                        ", 
        "                                                                                ",
    ],
    
];


const rhombus = [
    "                                       -=                                       ",
    "                                      -  =                                      ",
    "                                     -    =                                     ", 
    "                                    -      =                                    ",  
    "                                   -        =                                   ", 
    "                                  -          =                                  ", 
    "                                 -            =                                 ", 
    "                                -              =                                ", 
    "                               -                =                               ", 
    "                              -                  =                              ",
    "                             -                    =                             ",
    "                            -                      =                            ", 
    "                           -                        =                           ",  
    "                          -                          =                          ", 
    "                         -                            =                         ", 
    "                        -                              =                        ", 
    "                       -                                =                       ", 
    "                      -                                  =                      ", 
    "                     -                                    =                     ",
    "                    -                                      =                    ",
    "                   -                                        =                   ", 
    "                  -                                          =                  ",  
    "                  =                                          -                  ", 
    "                   =                                        -                   ", 
    "                    =                                      -                    ", 
    "                     =                                    -                     ", 
    "                      =                                  -                      ", 
    "                       =                                -                       ",
    "                        =                              -                        ",
    "                         =                            -                         ", 
    "                          =                          -                          ",  
    "                           =                        -                           ", 
    "                            =                      -                            ", 
    "                             =                    -                             ", 
    "                              =                  -                              ", 
    "                               =                -                               ", 
    "                                =              -                                ",
    "                                 =            -                                 ",
    "                                  =          -                                  ", 
    "                                   =        -                                   ",  
    "                                    =      -                                    ", 
    "                                     =    -                                     ", 
    "                                      =  -                                      ", 
    "                                       =-                                       ", 
    "                                                                                ", 
]

const background = [
    "                                                                                ",
    "                                      +++                                       ",
    "                                     +++++                                      ", 
    "                                    +++++++                                     ",  
    "                                   +++++++++                                    ", 
    "                                  +++++++++++                                   ", 
    "                                 +++++++++++++                                  ", 
    "                                +++++++++++++++                                 ", 
    "                               +++++++++++++++++                                ", 
    "                              +++++++++++++++++++                               ",
    "                             +++++++++++++++++++++                              ",
    "                            +++++++++++++++++++++++                             ", 
    "                           +++++++++++++++++++++++++                            ",  
    "                          +++++++++++++++++++++++++++                           ", 
    "                         +++++++++++++++++++++++++++++                          ", 
    "                        +++++++++++++++++++++++++++++++                         ", 
    "                       +++++++++++++++++++++++++++++++++                        ", 
    "                      +++++++++++++++++++++++++++++++++++                       ", 
    "                     +++++++++++++++++++++++++++++++++++++                      ",
    "                    +++++++++++++++++++++++++++++++++++++++                     ",
    "                   +++++++++++++++++++++++++++++++++++++++++                    ", 
    "                  +++++++++++++++++++++++++++++++++++++++++++                   ",  
    "                  +++++++++++++++++++++++++++++++++++++++++++                   ", 
    "                   +++++++++++++++++++++++++++++++++++++++++                    ", 
    "                    +++++++++++++++++++++++++++++++++++++++                     ", 
    "                     +++++++++++++++++++++++++++++++++++++                      ", 
    "                      +++++++++++++++++++++++++++++++++++                       ", 
    "                       +++++++++++++++++++++++++++++++++                        ",
    "                        +++++++++++++++++++++++++++++++                         ",
    "                         +++++++++++++++++++++++++++++                          ", 
    "                          +++++++++++++++++++++++++++                           ",  
    "                           +++++++++++++++++++++++++                            ", 
    "                            +++++++++++++++++++++++                             ", 
    "                             +++++++++++++++++++++                              ", 
    "                              +++++++++++++++++++                               ", 
    "                               +++++++++++++++++                                ", 
    "                                +++++++++++++++                                 ",
    "                                 +++++++++++++                                  ",
    "                                  +++++++++++                                   ", 
    "                                   +++++++++                                    ",  
    "                                    +++++++                                     ", 
    "                                     +++++                                      ", 
    "                                      +++                                       ", 
    "                                       +                                        ", 
    "                                                                                ", 
]

const menubg = [
    "====================",
    "-                 a-",
    "-                  -",
    "- $                -",
    "-              @   -",
    "-                  -",
    "-                  -",
    "-                  -",
    "-                  -",
    "-&                 -",
    "====================",
    "====================",
]

const levelbg = [
    "====================",
    "-                  -",
    "-                  -",
    "-                  -",
    "-                  -",
    "-                  -",
    "-                  -",
    "-                  -",
    "-                  -",
    "-                  -",
    "====================",
    "====================",
]

go("start");