/**
 * Library to generate a unique key for a component. Currently just generates
 * a key from the current timestamp and some random numbers
 */

let ComponentKey = {
    generate: () => {
        var time = Date.now();
        var random = Math.random() * Math.random();
        return Math.floor(time * random);
    },
}

export default ComponentKey;