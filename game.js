// SpriteSheet
sprites = new Image();
sprites.src = 'frogger_sprites.png';
ctx = 0;

// Dynamic Objects in game mode.
middlesizelogs = new Object();
turtles2nos = new Object();
largelogs = new Object();
smallLogs = new Object();
turtles3nos = new Object();
semis = new Object();
racecars = new Object();
pinkracecars = new Object();
tractors = new Object();
yellowracecars = new Object();
frog = new Object();
fly = new Object();

lanes = [];
slots = [];
turtles = [turtles2nos, turtles3nos]
cars = [semis, racecars, pinkracecars, tractors, yellowracecars];
logs = [middlesizelogs, largelogs, smallLogs];

// Objects/game Functionality.
board = new Object();
time = new Object();
score = 0;
highscore = 0;
level = 1;
lives = 4;
gameover = 0;
safefrogs = 0;
lanespassed = 0;
rndmslot = 0;
rndmnum = 3;
speed = 1;


function start_game() {
    canvas = document.getElementById('game');

    // Check that browser supports game
    if (canvas.getContext) {
        ctx = canvas.getContext('2d');

        init_win_slots();
        init_lanes();
        init_parameters();
        set_board();

        document.addEventListener("keydown", function() { move_frog(event) });

        setInterval(function() { move_cars_logs_turtles(speed) }, 60);
        setInterval(update_time, 1000);
        setInterval(generate_random_nums, 3000);
        setInterval(check_frog_pinnedmovewith, 1);
        setInterval(game_loop, 60);
    } else { alert('Browser not supported!'); }
}


// Loops through the game stages.
function game_loop() {

    // When frog makes it across safely
    if (frog.lane == 0 && is_safe_across()) {
        crossed_safely();
    }

    // If frog dies
    if (is_collision() || is_in_water() || is_out_of_bounds() || is_out_of_time() || !is_safe_across()) {
        lives--;
        reset_frog();
    }

    // If player has no frog lives left
    if (lives == 0) {
        game_over();
    }
}

// Generates a random number from 1-10 and picks random slot b/w 1-5.
function generate_random_nums() {
    rndmslot = Math.floor(Math.random() * 101) % 5;
    rndmnum = Math.floor(Math.random() * 11);
}


/* Returns true if 40 seconds passes and 
the player has not moved frog to an empty slot */
function is_out_of_time() {
    if (time.timer == time.max) {
        return 1;
    }
    return 0;
}

// Updates score and resets frog to original position.
function crossed_safely() {
    safefrogs++;
    frog.lane = 12;
    frog.x = 0;
    score += 30;
    if (safefrogs == 5) {
        safefrogs = 0;
        level++;
        score += 1000;
        speed++;

        for (i in slots) {
            slots[i].isfull = 0;
        }
    }
    for (j in lanes) {
        lanes[j].ispassed = 0;
    }
    if (is_get_fly()) {
        frog.is_get_fly = 0;
        score += 200;
    }
    check_for_10K();
    reset_frog();
}


// Resets frog position and deducts a frog life.
function reset_frog() {
    time.timer = 0;
    frog.ispinned = 0;
    objspeed = 0;
    frog.lane = 12;
    frog.isactive = 0;
    time.isactive = 0;
    frog.x = 1;
    setTimeout(function() {
        objspeed = level;
        time.x = 235;
        time.w = 120;
        frog.isactive = 1;
        if (lives != 0) {
            time.isactive = 1;
        }
    }, 500);
}


// Restarts Game
function game_over() {
    objspeed = 0;
    frog.isactive = 0;
    gameover = 1;
    setTimeout(function() {
        gameover = 0;
        frog.isactive = 1;
        objspeed = 1;
        score = 0;
        level = 1;
        speed = 1;
        lives = 4;
        time.x = 235;
        time.w = 120;
        time.isactive = 1;
    }, 3000);
}

// Returns true if frog ate a fly
function is_get_fly() {
    if (slots.lastfilled == fly.slot) {
        return 1;
    }
    return 0;
}

// Adds a life if player score = 1,000 and players has less than 3 lives left
function check_for_10K() {
    if ((score % 1000) == 0 && lives < 3) {
        lives++;
    }
}

// Updates Game Timer
function update_time() {
    time.timer++;
    time.x += 2;
    time.w -= 2;
}

// Initializes Lane heights.
function init_lanes() {
    let laneheight = 33.4;
    let y = 78;

    // Lane position starting from top to bottom
    for (let i = 0; i < 13; i++) {
        let temp = new Object();
        temp.y = y;
        y += laneheight;
        lanes.push(temp);
    }
}

// Initializes Game Parameters
function init_parameters() {
    board.w = 370;
    board.h = 513;
    frog.ispinned = 0;
    frog.isactive = 1;
    time.isactive = 1;
    time.max = 40;
    time.timer = 0;
    time.x = 235;
    time.w = 110;

    //init_objects(   obj, ln, ofst, itr,  x,   y,    w,  h,  sw, sh,  sx,  sy )
    init_obj(fly, 0, 0, 1, 0, lanes[0].y, 18, 18, 18, 18, 139, 235);
    init_obj(middlesizelogs, 0, 49, 3, 80, lanes[1].y, 120, 25, 120, 25, 5, 197);
    init_obj(turtles2nos, 2, 58, 4, 0, lanes[2].y, 33, 25, 33, 25, 13, 405);
    init_obj(largelogs, 3, 84, 2, 0, lanes[3].y, 180, 25, 180, 25, 5, 166);
    init_obj(smallLogs, 4, 84, 3, 50, lanes[4].y, 88, 25, 88, 25, 5, 228);
    init_obj(turtles3nos, 2, 58, 4, 0, lanes[5].y, 33, 25, 33, 25, 13, 405);
    init_obj(semis, 7, 84, 2, 80, lanes[7].y, 50, 27, 50, 22, 106, 301);
    init_obj(racecars, 8, 84, 3, 50, lanes[8].y, 30, 27, 30, 27, 46, 263);
    init_obj(pinkracecars, 9, 84, 3, 30, lanes[9].y, 31, 27, 31, 24, 10, 266);
    init_obj(tractors, 10, 84, 3, 0, lanes[10].y, 27, 27, 29, 27, 10, 301);
    init_obj(yellowracecars, 11, 84, 3, 80, lanes[11].y, 30, 27, 30, 27, 80, 263);
    init_obj(frog, 12, 0, 1, 1, lanes[12].y, 24, 27, 24, 27, 13, 366);
}



// Initializes objects parameters
function init_obj(obj, lane, offset, iterations, x, y, w, h, sw, sh, sx, sy) {
    switch (iterations) {
        case 1:
            obj.x = x;
            break;
        case 2:
            obj.x = [x, (x + w + offset)];
            break;
        case 3:
            obj.x = [x, (x + w + offset), (x + 2 * (w + offset))];
            break;
        case 4:
            if (obj == turtles2nos) {
                obj.x = [(x + (0 * w) + (0 * offset)),
                    (x + (1 * w) + (0 * offset)),

                    (x + (2 * w) + (1 * offset)),
                    (x + (3 * w) + (1 * offset)),

                    (x + (4 * w) + (2 * offset)),
                    (x + (5 * w) + (2 * offset)),

                    (x + (6 * w) + (3 * offset)),
                    (x + (7 * w) + (3 * offset)),

                    (x + (8 * w) + (4 * offset)),
                    (x + (9 * w) + (4 * offset))
                ];
            }
            if (obj == turtles3nos) {
                obj.x = [(x + (0 * w) + (0 * offset)),
                    (x + (1 * w) + (0 * offset)),
                    (x + (2 * w) + (0 * offset)),

                    (x + (3 * w) + (1 * offset)),
                    (x + (4 * w) + (1 * offset)),
                    (x + (5 * w) + (1 * offset)),

                    (x + (6 * w) + (2 * offset)),
                    (x + (7 * w) + (2 * offset)),
                    (x + (8 * w) + (2 * offset)),

                    (x + (9 * w) + (3 * offset)),
                    (x + (10 * w) + (3 * offset)),
                    (x + (11 * w) + (3 * offset))
                ];
            }
            break;
    }

    obj.lane = lane;
    obj.y = y;
    obj.w = w;
    obj.h = h;
    obj.sw = sw;
    obj.sh = sh;
    obj.sx = sx;
    obj.sy = sy;

    obj.xbxs = x;
    obj.xbse = x + w;
}

// in game stationary objects
function set_board() {
    ctx.fillStyle = "rgb(25, 25, 112)"; // water color
    ctx.fillRect(0, 0, 399, 272); // Draw Water
    ctx.fillStyle = "rgb(0, 0, 0)"; //black
    ctx.fillRect(0, 272, 399, 293); // Street
    ctx.drawImage(sprites, 14, 13, 319, 32, 35, 10, 319, 32); // Title
    ctx.drawImage(sprites, 0, 55, 399, 56, 0, 55, 399, 56); // Grass
    ctx.drawImage(sprites, 0, 119, 399, 35, 0, 272, 399, 35); // Sidewalk up
    ctx.drawImage(sprites, 0, 119, 399, 35, 0, 474, 399, 35); // Sidewalk down
    update_game();
    update_text();
}

// Draws Moving Objects
function update_game() {
    switch (lives) {
        case 4:
            ctx.drawImage(sprites, 13, 334, 19, 22, 20, 512, 19, 22); // Life
        case 3:
            ctx.drawImage(sprites, 13, 334, 19, 22, 40, 512, 19, 22); // Life
        case 2:
            ctx.drawImage(sprites, 13, 334, 19, 22, 60, 512, 19, 22); // Life

    }

    for (i in cars) {
        for (j in cars[i].x) {
            ctx.drawImage(sprites, cars[i].sx, cars[i].sy, cars[i].w, cars[i].h,
                cars[i].x[j], cars[i].y, cars[i].w, cars[i].h);
        }
    }

    // Draw Logs	  
    for (i in logs) {
        for (j in logs[i].x) {
            ctx.drawImage(sprites, logs[i].sx, logs[i].sy, logs[i].w, logs[i].h,
                logs[i].x[j], logs[i].y, logs[i].w, logs[i].h);
        }
    }

    // Draw Turtles	  
    for (i in turtles) {
        for (j in turtles[i].x) {
            ctx.drawImage(sprites, turtles[i].sx, turtles[i].sy, turtles[i].w,
                turtles[i].h, turtles[i].x[j], turtles[i].y, turtles[i].w,
                turtles[i].h);
        }
    }

    // Draw Frog
    if (!frog.isdead) {
        ctx.drawImage(sprites, frog.sx, frog.sy, frog.w, frog.h, frog.x,
            lanes[frog.lane].y, frog.w, frog.h);
    }

    // Draw Slot Frogs
    for (i in slots) {
        if (slots[i].isfull) {
            ctx.drawImage(sprites, 79, 368, 24, 20, slots[i].start + 3,
                lanes[0].y, 24, 20);
        }
    }

    // Draw Fly
    if (rndmnum % 4 == 0 && slots[rndmslot].isfull == 0) {
        fly.slot = rndmslot;
        ctx.drawImage(sprites, fly.sx, fly.sy, fly.w, fly.h, (slots[rndmslot].start + 8),
            lanes[fly.lane].y, fly.w, fly.h);
    }

}

// places Score, Time, lives,  Timer display & Game Over message in game.
function update_text() {
    ctx.fillStyle = "rgb(0, 255, 0)";
    ctx.font = 'bold 30px sans-serif';
    ctx.textBaseline = 'bottom';
    ctx.fillText('Level ' + level, 100, 540); // Update Level

    ctx.font = 'bold 17px sans-serif';
    ctx.textBaseline = 'bottom';
    ctx.fillText('Score: ' + score, 0, 560); // Update Score

    if (time.isactive) {
        ctx.fillRect(time.x, 545, time.w, 15);
    }
    ctx.fillStyle = "yellow";
    ctx.font = 'bold 17px sans-serif';
    ctx.fillText('Time', 358, 562); // Time

    if (gameover) {
        ctx.fillStyle = "white";
        ctx.fillRect(115, 274, 150, 30);
        ctx.fillStyle = "red";
        ctx.font = 'bold 25px sans-serif';
        ctx.fillText('Game Over', 125, 304); // Update GameOver
    }
}


// Moves frog up/down/left/right
function move_frog(event) {
    let x;
    if (frog.isactive) {
        if (event.keyCode == 37 || event.keyCode == 38 || event.keyCode == 39 ||
            event.keyCode == 40) {
            frog.ispinned = 0;
            switch (event.keyCode) {
                case 37: // Move frog left
                    if (frog.x > 2) {
                        x = frog.x - frog.w;
                        if (x > 0)
                            frog.x = x;
                        else
                            frog.x = 1;
                    }
                    break;
                case 38: // Move frog up
                    if (frog.lane > 0) {
                        frog.lane--;
                        if (!lanes[frog.lane].ispassed) {
                            lanes[frog.lane].ispassed = 1;
                            score += 10;
                            check_for_10K();
                        }
                    }
                    break;
                case 39: // Move frog right
                    if (frog.x < 362) {
                        x = frog.x + frog.w;
                        if (x < 362)
                            frog.x = x;
                        else
                            frog.x = 377;
                    }
                    break;
                case 40: // Move frog down
                    if (frog.lane < 12) {
                        frog.lane++;
                    }
                    break;
            }
            set_board();
            update_game();
            is_pinned();
        }
    }
}

// If frog stays on an object it moves with object.
function check_frog_pinnedmovewith() {
    if (frog.ispinned) {
        frog.x = frog.pinnedobj[frog.pinnediter] + frog.pinnedoffset;
        set_board();
        update_game();
    }
}



/* Moves cars, logs, turtles across game 
at simultaneous speed which depend on the function parameter objspeed */
function move_cars_logs_turtles(objspeed) {
    let buffer = 60;

    // Move Cars in Odd Lanes to the Left
    for (i = 1; i < 5; i = i + 2) {
        for (j in cars[i].x) {
            for (k = 0; k < objspeed; k++) {
                cars[i].x[j] += 1;
                if (cars[i].x[j] == board.w + buffer) {
                    cars[i].x[j] = -30;
                }
            }
        }
    }

    // Move Cars in Even Lanes to the right
    for (i = 0; i < 5; i = i + 2) {
        for (j in cars[i].x) {
            for (k = 0; k < (objspeed * 2); k++) {
                cars[i].x[j] -= 1;
                if (cars[i].x[j] == -buffer) {
                    cars[i].x[j] = 380;
                }
            }
        }
    }


    // Move Logs to the Right
    for (i = 0; i < 3; i++) {
        for (j in logs[i].x) {
            switch (i) {
                case 0: // Medium size Logs
                    for (k = 0; k < objspeed * 1; k++) {
                        logs[i].x[j] += 1;
                        if (logs[i].x[j] == board.w + buffer) {
                            logs[i].x[j] = -logs[i].w;
                        }
                    }
                    break;
                case 1: // Large size Logs
                    for (k = 0; k < (objspeed * 3); k++) {
                        logs[i].x[j] += 1;
                        if (logs[i].x[j] == board.w + buffer) {
                            logs[i].x[j] = -logs[i].w;
                        }
                    }
                    break;
                case 2: // Small size Logs
                    for (k = 0; k < (objspeed * 2); k++) {
                        logs[i].x[j] += 1;
                        if (logs[i].x[j] == board.w + buffer) {
                            logs[i].x[j] = -logs[i].w;
                        }
                    }
                    break;
            }
        }
    }

    // Move Turtles to the Left
    let tribuffer = 550;
    for (i = 0; i < 2; i++) {
        for (j in turtles[i].x) {
            switch (i) {
                case 0: // Group of 2 Turtles
                    for (k = 0; k < objspeed * 1; k++) {
                        turtles[i].x[j] -= 1;
                        if (turtles[i].x[j] == -buffer) {
                            turtles[i].x[j] = (turtles[i].w * 2) + tribuffer;
                        }
                    }
                    break;
                case 1: // Group of 3 Turtles
                    for (k = 0; k < objspeed * 3; k++) {
                        turtles[i].x[j] -= 1;
                        if (turtles[i].x[j] == -buffer) {
                            turtles[i].x[j] = (turtles[i].w * 3) + tribuffer;
                        }
                    }
                    break;
            }
        }
    }

    set_board();
    update_game();
}

// Returns true if the frog occupies the same space as the cars from lanes 7-11
function is_collision() {
    if (frog.lane > 6 && frog.lane < 12) {
        let lane = frog.lane - 7;
        for (car in cars[lane].x) {
            if (frog.x + frog.w >= cars[lane].x[car] &&
                frog.x <= cars[lane].x[car] + cars[lane].w) {
                return 1;
            }
        }
    }
    return 0;
}

// Returns true if the frog is in an empty slot.
function is_safe_across() {
    if (frog.lane == 0) {
        if (frog.x > slots[0].start && (frog.x + frog.w) < slots[0].end &&
            !slots[0].isfull) {
            slots[0].isfull = 1;
            slots.lastfilled = 0;
            return 1;
        } else if (frog.x > slots[1].start && (frog.x + frog.w) < slots[1].end &&
            !slots[1].isfull) {
            slots[1].isfull = 1;
            slots.lastfilled = 1;
            return 1;
        } else if (frog.x > slots[2].start && (frog.x + frog.w) < slots[2].end &&
            !slots[2].isfull) {
            slots[2].isfull = 1;
            slots.lastfilled = 2;
            return 1;
        } else if (frog.x > slots[3].start && (frog.x + frog.w) < slots[3].end &&
            !slots[3].isfull) {
            slots[3].isfull = 1;
            slots.lastfilled = 3;
            return 1;
        } else if (frog.x > slots[4].start && (frog.x + frog.w) < slots[4].end &&
            !slots[4].isfull) {
            slots[4].isfull = 1;
            slots.lastfilled = 4;
            return 1;
        } else { return 0; }
    }
    return 1;
}



// Constructor for the slots
function Winslot(x) {
    this.isfull = 0;
    this.start = x;
    this.end = x + 35;
}

function init_win_slots() {
    slots.push(new Winslot(10));
    slots.push(new Winslot(97));
    slots.push(new Winslot(181));
    slots.push(new Winslot(265));
    slots.push(new Winslot(352));
}



// Returns true if frog occupies the same space as any object from lanes 1-5
function is_pinned() {
    pinned_to = new Object();
    if (frog.lane == 1 || frog.lane == 3 || frog.lane == 4) {
        let lane = 0;
        switch (frog.lane) {
            case 1:
                lane = 0;
                break;
            case 3:
                lane = 1;
                break;
            case 4:
                lane = 2;
                break;
        }
        for (log in logs[lane].x) {
            if (frog.x + frog.w >= logs[lane].x[log] &&
                frog.x <= logs[lane].x[log] + logs[lane].w) {
                frog.ispinned = 1;
                frog.pinnedobj = logs[lane].x;
                frog.pinnediter = log;
                frog.pinnedoffset = frog.x - logs[lane].x[log];
                check_frog_pinnedmovewith();
                return 1;
            }
        }
    }
    if (frog.lane == 2 || frog.lane == 5) {
        let lane = 0;
        let width = 0;
        let itersum = 0;
        let buffer = 0;
        switch (frog.lane) {
            case 2:
                lane = 0;
                width = (2 * turtles[lane].w);
                itermult = 2;
                break;
            case 5:
                lane = 1;
                width = (3 * turtles[lane].w);
                itermult = 3;
                break;
        }
        for (let i = 0; i < turtles[lane].x.length; i++) {
            if (frog.x + frog.w >= turtles[lane].x[i] &&
                frog.x <= turtles[lane].x[i] + turtles[lane].w) {
                frog.ispinned = 1;
                frog.pinnedobj = turtles[lane].x;
                frog.pinnediter = i;
                frog.pinnedoffset = frog.x - turtles[lane].x[i];
                check_frog_pinnedmovewith();

                return 1;
            }
        }
    }
    return 0;
}



// Returns true if the frog is in the water.
function is_in_water() {
    if (frog.lane > 0 && frog.lane < 6) {
        if (!frog.ispinned) {
            return 1;
        }
    }
    return 0;
}

// Returns true if the frog is outside the game's parameter.
function is_out_of_bounds() {
    if (frog.x < 0 || frog.x > 380) {
        return 1;
    }
    return 0;
}