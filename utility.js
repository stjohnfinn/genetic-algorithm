export function randNum(min, max) {
    const output = Math.random() * (max - min + 1) + min;
    return output;
}

export function calcDist(x1, y1, x2, y2) {
    let a = x2 - x1;
    let b = y2 - y1;
    return Math.sqrt( (a * a) + (b * b) );
}

export function randomHex() {
    let r = randNum(0, 255);
    let g = randNum(0, 255);
    let b = randNum(0, 255);

    let output = '0x';
    output += decToHex(r);
    output += decToHex(g);
    output += decToHex(b);

    return output;
}

export function decToHex(x) {
    let output = [];
    
    if ( x < 16 ) {
        return [0, HEX[x]].join('');
    }

    while (x > 16) {
        let quotient = Math.floor( x / 16 );
        let r = x % 16;
        output.push(HEX[r]);
        x = quotient;
    }

    output.push(HEX[x]);

    return output.join('');
}

const HEX = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    'a',
    'b',
    'c',
    'd',
    'e',
    'f'
];