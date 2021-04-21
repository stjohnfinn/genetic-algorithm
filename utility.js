export function randNum(min, max) {
    const output = Math.random() * (max - min + 1) + min;
    return output;
}

export function calcAngleTo(x1, y1, x2, y2) {
    let y = y2 - y1;
    let x = x2 - x1;
    let theta = Math.atan(y / x);
    if (x2 == x1) {
        if (y2 > y1) {
            return Math.PI;
        } else if (y2 < y1) {
            return -Math.PI;
        }
    } else if (x2 < x1) {
        theta += Math.PI;
    }

    return theta;
}

export function calcDist(x1, y1, x2, y2) {
    let a = x2 - x1;
    let b = y2 - y1;
    return Math.sqrt( (a * a) + (b * b) );
}

export function univGrav(m1, m2, d) {
    let g = 6.67 * Math.pow(10, -11);
    let m = m1 * m2;
    return g * m / ( d * d);
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