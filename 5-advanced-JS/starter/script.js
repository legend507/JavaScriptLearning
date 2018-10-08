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

