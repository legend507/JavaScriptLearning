/***********
 * Function Constructor
 * ************/
// an object 
var john = {
    name: 'John', 
    birthday: 1990,
    job: 'cleaner',
};

// function constructor
var Person = function(name, birthday, job) {
    this.name = name;
    this.birthday = birthday;
    this.job = job;
}

/*
Person.prototype.calculateAge = function() {
    console.log(2018 - this.birthday);
}
*/

// "new" operator first creates an empty object, and then the Person function upthere fills up the object and returns
var john = new Person('John', 1990, 'cleaner');


/***************************:
 * Primitives vs. Objects
 */
//  primitives are basic var types (int, char, etc.)
var a = 23;
var b = a;
a = 46;
console.log(a); // 46
console.log(b); // 23
//---
var obj1 = {
    name: 'a',
    age: 26,
};
var obj2 = obj1;
obj1.age = 100;
console.log(obj1.age);  // 100
console.log(obj2.age);  // 100 <- attention to this! Because obj2 is actually a pointer

/********************
 * In JavaScript, function(a) { do something to a }
 *  when a is a primitive, the change does NOT reflect outside of the function
 *  when a is an object, the chage reflects 
 */


/**
 * Function accept another function as parameter
 */
var arr = [1, 2, 3, 4, 5];
function arrayCalc(arr, fn) {
    var arrRes = [];
    for(var i = 0; i < arr.length; i++) {
        arrRes.push(fn(arr[i]));
    }
    return arrRes;
}
function fn(element) {
    element ++;
    return element;
}

console.log(arrayCalc(arr, fn));

/********************
 * Function returns functions
 */
function interviewQs(job) {
    if (job === 'designer') {
        return function(name) {
            console.log(name + ', really, impresive!');
        }
    } else {
        return function(name) {
            console.log(name + ', OK, not a real job~');
        }
    }
}

var Qs = interviewQs('designer');   // use Qs to receive the returned function
Qs('SB');                           // call the function

interviewQs('designer')('Jesus');