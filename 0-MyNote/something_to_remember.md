---
__About Markdown Language :)__
Refer to __[demo](https://markdown-it.github.io/) for more information.
---

# Constructor function
Sometimes need to create several similar objects.

## Example 1: easiest way to make an object
Can only create an object 'john' that has name, birthday and job.
Need to repeat if want to have other similar objects. `Not a good way!`
``` js
var john = {
    name: 'John', 
    birthday: 1990,
    job: 'cleaner',
};
```

## Example 2: function constructor.
Offers an easy way to create similar objects.
Attention to the 2 ways of adding functions to an object. `This is a good way!`
``` js
// Constructor function
var Person = function(name, birthday, job) {
    this.name = name;
    this.birthday = birthday;
    this.job = job;

    // 1st way to declare a function in an object
    this.func1 = function(para) {
        // do something
    }
}

// 2nd way to extend (add) a function to an object
Person.prototype.func2 = function() {
    // do something, like
    console.log(this.birthday);
}

// "new" operator first creates an empty object, and then the Person function upthere fills up the object and returns
var john = new Person('John', 1990, 'cleaner');
```

# Primitives vs. Objects
Primitives and objects are treated differently.
## Primitives are variables stored in a memory region.
``` js
//  primitives are basic var types (int, char, etc.)
var a = 23;
var b = a;
a = 46;
console.log(a); // 46
console.log(b); // 23
```
## Objects are pointers to a memory region.
``` js
var obj1 = {
    name: 'a',
    age: 26,
};
var obj2 = obj1;
obj1.age = 100;
console.log(obj1.age);  // 100
console.log(obj2.age);  // 100 <- attention to this! Because obj2 is actually a pointer
```

# Funtion takes in other functions
Function can either return another function or take another function as input parameter.
## Return a function
``` js
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

// to call this function.
// 1st way
var Qs = interviewQs('designer');   // use Qs to receive the returned function
Qs('SB');                           // call the function
// 2nd way
interviewQs('designer')('Jesus');
```
## Take function as input
``` js
var arr = [1, 2, 3, 4, 5];
// attention: fn has no ()
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
```

# Immediately Invoked Function Expression (IIFE)
More like a coding style thing. But IIFE is said to offer high privacy. `Don't know how...`
``` js
// conventional way to define and call a function
function game() {
    var score = Math.random() * 10;
    console.log(score >= 5);
}
game();

// IIFE way of calling a function. This function can not be re-called else where.
(function (goodLuck) {
    var score = Math.random() * 10;
    console.log(score >= 5 - goodLuck);
})(5);
```

# Apply, Call, Bind for functions
Apply, call and bind are used to change 'this' in one object so that this object's functions can tale another object as its 'this'.
``` js
// Base code, note that john has presentation function but emily does not.
var john = {
    name: 'John',
    age: 26,
    job: 'teacher',
    presentation: function(style, timeOfDay) {
        if (style === 'formal') {
            console.log('Good ' + timeOfDay + ', Ladies and gentlemen! I\'m ' +  this.name + ', I\'m a ' + this.job + ' and I\'m ' + this.age + ' years old.');
        } else if (style === 'friendly') {
            console.log('Hey! What\'s up? I\'m ' +  this.name + ', I\'m a ' + this.job + ' and I\'m ' + this.age + ' years old. Have a nice ' + timeOfDay + '.');
        }
    }
};

var emily = {
    name: 'Emily',
    age: 35,
    job: 'designer'
};
```
## Call
To use johb's presentation function on emily. 
``` js
john.presentation.call(emily, 'friendly', 'afternoon');
```
## Apply
Don't understand this. Supposed to be very similar to Call.
## Bind
Attention, bind does NOT immediately call the function, but instead generate `a copy of the function`.
``` js
// to bind the first parameter 
var johnFriendly = john.presentation.bind(john, 'friendly');
johnFriendly('morning');
johnFriendly('night');

// to bind the john's presentation function to emily, with first parameter fixed
var emilyFormal = john.presentation.bind(emily, 'formal');
emilyFormal('afternoon');
```
