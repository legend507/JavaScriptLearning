const years = [1, 2, 3, 4, 5];

// in ES5
// age will be an array of [2016 - 1, 2016 - 2, ...]
var age5 = years.map(function(el) {
    return 2016 - el;
});
console.log(age5);

// in ES6, there is a new "arrow function"
const age6 = years.map(el => 2016 - el);
console.log(age6);
