import { randomHex, randNum, calcDist } from './utility.js';
import { weightedRandom } from './weightedRandom.js';

const loader = PIXI.Loader.shared;
const WIDTH = 1150;
const HEIGHT = 700;
const X_ACC = 0;
const Y_ACC = 1;

let canvasX = 0;
let canvasY = 0;
let mouseXRel = 0;
let mouseYRel = 0;
let movingRedPlanet = false;
let movingBluePlanet = false;
let movingEarth = false;
let RED_PLANET = {
    x: 500,
    y: 150,
    width: 75
};
let BLUE_PLANET = {
    x: 700,
    y: HEIGHT - 170,
    width: 50
};
let EARTH = {
    x: WIDTH - 100,
    y: HEIGHT / 2,
    width: 90
};

let rocketCount = 20;
let mutationChance = 5;
let chromosomesCount = 40;
let cycleRate = 100;

const app = new PIXI.Application({width: WIDTH, height: HEIGHT });
$('#pixi-canvas').append(app.view);

// Might be able to just stick VV this in a function and call it on a button press

function start() {

    loader
    .add('./images/rocket.png')
    .add('./images/earth.png')
    .add('./images/blue-planet.png')
    .add('./images/red-planet.png')
    .load(setup);
}

$('#start-button').click( () => {
    $('#start-button').prop('disabled', true);

    rocketCount = $('#rocket-count').val();
    mutationChance = $('#mutation-chance').val();
    chromosomesCount = $('#chromosome-count').val();
    cycleRate = $('#cycle-rate').val();

    start();
});

//The actual code thats not just setup

let population = [];
let isRunning = false;

//chromosome rotation counter
let CRC = 0;
let generation = 0;
let averageFitness = 0;
let crcIntervalId = 0;

let redPlanet;
let bluePlanet;
let earth;

function setup() {
    app.renderer.backgroundColor = '0x101010';
    app.renderer.view.style.border = '2px black solid';
    app.renderer.view.style.borderRadius = '4px';

    redPlanet = new Obstacle(RED_PLANET.x, RED_PLANET.y, RED_PLANET.width, 0x5B5B5B);
    bluePlanet = new Obstacle(BLUE_PLANET.x, BLUE_PLANET.y, BLUE_PLANET.width, 0x5B5B5B);
    earth = new Obstacle(EARTH.x, EARTH.y, EARTH.width, 0x7D976B);

    app.ticker.add(delta => gameLoop(delta));

    createFirstGen();

    $('#pixi-canvas').on('mousedown', event => {
        canvasX = document.querySelector('#pixi-canvas').getBoundingClientRect().x;
        canvasY = document.querySelector('#pixi-canvas').getBoundingClientRect().y;
        mouseXRel = event.pageX - canvasX - window.pageXOffset;
        mouseYRel = event.pageY - canvasY - window.pageYOffset;
        if (calcDist(mouseXRel, mouseYRel, redPlanet.sprite.x, redPlanet.sprite.y) < RED_PLANET.width) {
            movingRedPlanet = !movingRedPlanet;
        } if (calcDist(mouseXRel, mouseYRel, bluePlanet.sprite.x, bluePlanet.sprite.y) < BLUE_PLANET.width) {
            movingBluePlanet = !movingBluePlanet;
        } if (calcDist(mouseXRel, mouseYRel, earth.sprite.x, earth.sprite.y) < EARTH.width) {
            movingEarth = !movingEarth;
        }
    });
    
    $('body').on('keydown', event => {
        if (movingRedPlanet) {
            if (event.key == 'ArrowRight') {
                redPlanet.sprite.x += 10;
            } if (event.key == 'ArrowLeft') {
                redPlanet.sprite.x -= 10;
            } if (event.key == 'ArrowDown') {
                redPlanet.sprite.y += 10;
            } if (event.key == 'ArrowUp') {
                redPlanet.sprite.y -= 10;
            }
        } if (movingBluePlanet) {
            if (event.key == 'ArrowRight') {
                bluePlanet.sprite.x += 10;
            } if (event.key == 'ArrowLeft') {
                bluePlanet.sprite.x -= 10;
            } if (event.key == 'ArrowDown') {
                bluePlanet.sprite.y += 10;
            } if (event.key == 'ArrowUp') {
                bluePlanet.sprite.y -= 10;
            }
        } if (movingEarth) {
            if (event.key == 'ArrowRight') {
                earth.sprite.x += 10;
            } if (event.key == 'ArrowLeft') {
                earth.sprite.x -= 10;
            } if (event.key == 'ArrowDown') {
                earth.sprite.y += 10;
            } if (event.key == 'ArrowUp') {
                earth.sprite.y -= 10;
            }
        }
    });
}

function createFirstGen() {
    for (let i = 0; i < rocketCount; i++) {
        population.push(new Rocket());

        for (let j = 0; j < chromosomesCount; j++) {
            population[i].genes.push([randNum(-2, 1), randNum(-2, 1)]);
        }
    }

    lifecycle();
}

function lifecycle() {
    generation++;
    CRC = 0;

    for (let i = 0; i < population.length; i++) {
        population[i].xacc = population[i].genes[CRC][X_ACC];
        population[i].yacc = population[i].genes[CRC][Y_ACC];
    }

    crcIntervalId = setInterval(updateAcceleration, cycleRate);
    isRunning = true;

    $('#gen').text('Generation: ' + generation);
    $('#fitness').text('Avg Fitness: ' + Math.trunc(averageFitness));
}

function gameLoop() {
    if (isRunning) {
        moveRockets();
        checkCollision();
        checkDeath();
    }
}

function moveRockets() {
    for (let i = 0; i < population.length; i++) {
        population[i].move();
    }
}

function updateAcceleration() {

    CRC++;

    if (CRC < chromosomesCount) {
        for (let i = 0; i < population.length; i++) {
            population[i].xacc = population[i].genes[CRC][X_ACC];
            population[i].yacc = population[i].genes[CRC][Y_ACC];
        }
    } else {
        for (let i = 0; i < population.length; i++) {
            population[i].shouldMove = false;
        }
    }
}

function checkCollision() {
    for (let i = 0; i < population.length; i++) {
        if (population[i].sprite.x > WIDTH) {
            population[i].shouldMove = false;
        } if (population[i].sprite.x < 0) {
            population[i].shouldMove = false;
        } if (population[i].sprite.y > HEIGHT) {
            population[i].shouldMove = false;
        } if (population[i].sprite.y < 0) {
            population[i].shouldMove = false;
        }
    }

    for (let i = 0; i < population.length; i++) {
        if (calcDist(population[i].sprite.x, population[i].sprite.y, redPlanet.sprite.x, redPlanet.sprite.y) < RED_PLANET.width) {
            population[i].shouldMove = false;
            population[i].crashed = true;
        } if (calcDist(population[i].sprite.x, population[i].sprite.y, bluePlanet.sprite.x, bluePlanet.sprite.y) < BLUE_PLANET.width) {
            population[i].shouldMove = false;
            population[i].crashed = true;
        } if (calcDist(population[i].sprite.x, population[i].sprite.y, earth.sprite.x, earth.sprite.y) < EARTH.width) {
            population[i].shouldMove = false;
            population[i].madeToGoal = true;
            population[i].sprite.scale.set(0.7);
            // population[i].sprite.rotation = Math.atan( (EARTH.y - population[i].sprite.y) / (EARTH.x - population[i].sprite.x) ) + Math.PI;
        }
    }
}

function checkDeath() {
    let allDead = true;

    for (let i = 0; i < population.length; i++) {
        if (population[i].shouldMove) {
            allDead = false;
        }
    }

    if (allDead) {

        isRunning = false;
        clearInterval(crcIntervalId);

        createNthGen();
        allDead = false;
    }
}

function createNthGen() {
    // 1. find the parents

    for (let i = 0; i < population.length; i++) {
        population[i].calcFitness();
        averageFitness += population[i].fitness;
    }
    averageFitness = averageFitness / population.length;

    $('#fitness').text('Average Fitness: ' + averageFitness);

    let rocketsRandomArray = [];
    for (let i = 0; i < population.length; i++) {
        rocketsRandomArray.push([population[i], population[i].fitness]);
    }

    let parentA = weightedRandom(rocketsRandomArray);

    for (let i = 0; i < population.length; i++) {
        if (population[i] == parentA) {
            rocketsRandomArray.splice(i, 1);
        }
    }

    let parentB = weightedRandom(rocketsRandomArray);

    // COMMENT THIS OUT LATER

    // parentB = parentA;


    // console.log('Parent A: ' + parentA.fitness);
    // console.log('Parent B: ' + parentB.fitness);

    // 2. perform crossover

    rocketsRandomArray = [];
    for (let i = 0; i < population.length; i++) {
        population[i].reset();
    }

    overwriteGenes(parentA, parentB);

    // 3. perform mutation

    mutateRockets();

    restart();

    lifecycle();
}

function overwriteGenes(parentA, parentB) {
    let splitIndex = randNum(chromosomesCount * 0.25, chromosomesCount * 0.75);
    for (let i = 0; i < population.length; i++) {
        for (let j = 0; j < chromosomesCount; j++) {
            if (j < splitIndex) {
                population[i].genes[j][X_ACC] = parentA.genes[j][X_ACC];
                population[i].genes[j][Y_ACC] = parentA.genes[j][Y_ACC];
            } else {
                population[i].genes[j][X_ACC] = parentB.genes[j][X_ACC];
                population[i].genes[j][Y_ACC] = parentB.genes[j][Y_ACC];
            }
        }
    }
}

function mutateRockets() {
    for (let i = 0; i < population.length; i++) {
        for (let j = 0; j < chromosomesCount; j++) {
            if (randNum(0, 100) < mutationChance) {
                population[i].genes[j][X_ACC] = randNum(-2, 1);
                population[i].genes[j][Y_ACC] = randNum(-2, 1);
            }
        }
    }
}

function restart() {
    isRunning = true;
}

class Rocket {
    constructor() {
        this.genes = [];
        this.sprite = new PIXI.Graphics();
        this.sprite.beginFill(0xFFFFFF, 0.5);
        this.sprite.drawPolygon([
            -20, -5,
            -20, -10,
            -8, -5,
            20, -5,
            30, 0,
            20, 5,
            -8, 5,
            -20, 10,
            -20, 5,
            -23, 3,
            -23, -3
        ]);
        this.sprite.endFill();
        this.sprite.x = 100;
        this.sprite.y = HEIGHT / 2;
        this.xvel = 1;
        this.yvel = 0;
        this.xacc = 0;
        this.yacc = 0;
        this.shouldMove = true;
        this.fitness = 0;
        this.madeToGoal = false;
        this.crashed = false;

        app.stage.addChild(this.sprite);
    }

    reset() {
        this.sprite.x = 100;
        this.sprite.y = HEIGHT / 2;
        this.sprite.scale.set(1);
        this.xvel = 1;
        this.yvel = 0;
        this.xacc = 0;
        this.yacc = 0;
        this.shouldMove = true;
        this.fitness = 0;
        this.sprite.rotation = 0;
        this.madeToGoal = false;
        this.crashed = false;
    }

    printGenes() {
        console.log(this.genes);
    }

    move() {
        if (this.shouldMove) {
            this.xvel += this.genes[CRC][X_ACC] / 60;
            this.yvel += this.genes[CRC][Y_ACC] / 60;

            this.sprite.x += this.xvel;
            this.sprite.y += this.yvel;

            if (this.xvel < 0) {
                this.sprite.rotation = Math.atan(this.yvel / this.xvel) + Math.PI;
            } else {
                this.sprite.rotation = Math.atan(this.yvel / this.xvel);
            }
        }
    }

    calcFitness() {
        this.fitness = Math.sqrt( WIDTH * WIDTH, HEIGHT * HEIGHT) - calcDist(this.sprite.x, this.sprite.y, EARTH.x, EARTH.y);

        if (this.madeToGoal) {
            this.fitness = this.fitness * 5;
        } if (this.crashed) {
            this.fitness = this.fitness / 2;
        }
    }
}

class Obstacle {

    constructor(x, y, width, color = '0xFFFFFF') {
        this.sprite = new PIXI.Graphics();
        this.sprite.beginFill(color, 0.9);
        this.sprite.drawCircle(0, 0, width);
        this.sprite.endFill();
        this.sprite.x = x;
        this.sprite.y = y;

        app.stage.addChild(this.sprite);
    }

    setPosition(x, y) {
        this.sprite.x = x;
        this.sprite.y = y;
    }
}