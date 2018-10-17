/***
 * an example of IIFE, this example demostrate how to offer data privacy
 *  in browser console, budgetController.x will be undefined
 *  */ 

/**
 * budgetController manages the income/expense records
 *  talk directly with controller module
 */
var budgetController = (function() {

    // function constructor
    var expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var recordContainer = {
        // to put all expense/income records in this
        records:    {
            expense:   [],
            income:    [],
        },
        // to calculate summary
        totals: {
            expense:    0,
            income:     0,
        }
    };

    return {
        // public API, to add item into recordContainer
        addItem:    function(type, des, val) {
            var newItem, id;
            // select the last element, get its ID, then plus 1
            if (recordContainer.records[type].length == 0) {
                id = 0;
            } else {
                id = recordContainer.records[type][recordContainer.records[type].length - 1].id + 1;
            }

            if(type === 'expense') {
                newItem = new expense(id, des, val);
            } else if (type === 'income') {
                newItem = new income(id, des, val);
            }
            // add to corresponding record
            recordContainer.records[type].push(newItem);

            return newItem;
        },

        // for debug
        printRecordContainer:   function() {
            console.log(recordContainer);
        },
    };

})();   // <- attention: do not forget ()


/**
 * UIController manages 
 *  1. get input data from web page
 *  2. display the income/expense records
 *  3. HTML DOM names
 */
var UIController = (function() {
    // to beautify things, have a container here to store all HTML strings
    var DOMStrings = {
        typeName:           '.add__type',
        descriptionName:    '.add__description',
        valueName:          '.add__value',
        checkButtonName:    '.add__btn',
        incomeContainer:    '.income__list',
        expenseContainer:   '.expenses__list',
    }

    // everything inside this return{...} is exposed to outside
    return {
        // get user input data from a web page
        getInput: function() {
            // return an object containing the 3 user input data
            return {
                type:       document.querySelector(DOMStrings.typeName).value,      // will be either income or expense
                description:document.querySelector(DOMStrings.descriptionName).value,
                value:      document.querySelector(DOMStrings.valueName).value,
            };
        },

        // to share DOM strings with controller module
        getDOMStrings:  function() {
            return DOMStrings;
        },

        // to add user input item to displayed list, controller calls this func
        addListItem: function(obj, type) {
            // create HTML string with placeholder text
            var placeHolder;
            var element;

            if(type === 'income') {
                element = DOMStrings.incomeContainer;
                placeHolder = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'expense') {
                element = DOMStrings.expenseContainer;
                placeHolder = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // replace placeholder text with actual data
            var HTMLString = placeHolder.replace('%id%', obj.id);
            HTMLString = HTMLString.replace('%description%', obj.description);
            HTMLString = HTMLString.replace('%value%', obj.value);

            // insert HTML into DOM (display), use insertAdjacentHTML API
            document.querySelector(element).insertAdjacentHTML('beforeend', HTMLString);

        },
    }
})();

/**
 * Global app controller
 * controller takes budgetController and UIControl in, do something and update the 2 Controllers
 * do not use budgetController directly as input, instead give it a nickname (budgetCtrl)
 * in this way, we can separate budgetController (outside name) from budgetCtrl (inside name) in controller module
 * controller manages
 *  1. init
 *  1. set event listener for click and key-press
 */
var controller = (function(budgetCtrl, UICtrl) {

    var setupEventListeners = function() {
        // get DOMStrings from UICtrl
        var DOM = UICtrl.getDOMStrings();

        // Case 1: when add__btn button is clicked
        // when selecting a class, need to add "." in front of class name
        document.querySelector(DOM.checkButtonName).addEventListener('click', ctrlAddItem);

        // Case 2: when "enter" is pressed
        document.addEventListener('keypress', function(event) {
            // keyCode indicates if "Enter" button is pressed
            if(event.keyCode == 13 || event.which == 13 /* for older browsers */) {
                //console.log('Enter is pressed;');
                ctrlAddItem();
            }
        });
    };

    var ctrlAddItem = function() {
        //This function does
        // * 1. get input data
        var input = UICtrl.getInput();          // calling UIController's method
        console.log(input);

        // * 2. add item to budget controller
        var newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        // * 3. add item to ui
        UICtrl.addListItem(newItem, input.type);

        // * 4. calculate the budget
        // * 5. display budget on ui

        console.log('adding item.')
    };

    return {
        // public initialization function
        init:       function() {
            // call setup event listeners function
            setupEventListeners();
        },
    }

})(budgetController, UIController);   

// calling the public initilization function here
controller.init();