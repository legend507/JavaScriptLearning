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
        this.percentage = -1;
    };
    // adding a new function for expense
    expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome !== 0) {
            this.percentage = Math.round(this.value / totalIncome * 100);
        } else {
            this.percentage = -1;
        }
    };
    expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    var income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    // calculate total income/expense
    var calcTotal = function(type) {
        var sum = 0;

        // traverse every records in recordCOntainer.record[]
        recordContainer.records[type].forEach(function(cur) {
            sum = sum + cur.value;
        });
        recordContainer.totals[type] = sum;
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
        },
        budget: 0,      // 
        percent: -1,     //
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

        // to delete an item, this API is called by global controller
        deleteItem: function(type, targetID) {
            // remeber id can not be continuous, so use .map to get a new array
            // newID is an array with same length of recordContainer.records[type], with the id as elements
            var newID = recordContainer.records[type].map(function(current) {
                return current.id;
            });
            // find the index of targetID in newID
            var index = newID.indexOf(targetID);
            // 
            if (index !== -1) {
                // splice removes elements in an array
                recordContainer.records[type].splice(index, 1);
            }

        },

        // calculate budget
        calcBudget: function() {
            // 1. total income/expense
            calcTotal('income');
            calcTotal('expense');

            // 2. calc budget = income - expense
            recordContainer.budget = recordContainer.totals.income - recordContainer.totals.expense;

            // 2. % of income spent
            if(recordContainer.totals.income > 0) {
                recordContainer.percent = Math.round(recordContainer.totals.expense / recordContainer.totals.income * 100);
            } else {
                recordContainer.percent = -1;
            }
        },

        // return current budget, UIController should take the return as input and display
        getBudget: function() {
            // return 4 values in 1 obj
            return {
                budget :    recordContainer.budget,
                totalIncome:    recordContainer.totals.income,
                totalExpense:   recordContainer.totals.expense,
                percent:    recordContainer.percent,
            };
        },

        // calculate percentage on each expense item
        calcPercentages:    function() {
            recordContainer.records.expense.forEach(function(cur) {
                cur.calcPercentage(recordContainer.totals.income);
            });
        },  
        getPercentages:     function() {
            // allPercentage is an array
            var allPercentages = recordContainer.records.expense.map(function(cur) {
                return cur.percentage;
            });

            return allPercentages;
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
        typeName:           '.add__type',           // user choose +/-
        descriptionName:    '.add__description',    // user input text
        valueName:          '.add__value',          // user input number
        checkButtonName:    '.add__btn',
        incomeContainer:    '.income__list',
        expenseContainer:   '.expenses__list',
        budgetLabel:        '.budget__value',
        incomeLabel:        '.budget__income--value',
        expenseLabel:       '.budget__expenses--value',
        percentageLabel:    '.budget__expenses--percentage',
        itemContainer:      '.container',
        expensePercentage:  '.item__percentage',
        yearMonth:          '.budget__title--month',
    };

    // format all displayed numbers
    var formatNumber = function(num, type) {
        /**
         * 1. add +/- to numbers
         * 2. 2 decimal points
         * 3. comma separate thousand, million, etc.
         */

        // 2 decimals
        num = Math.abs(num);
        num = num.toFixed(2);   // toFix is num prototype func, fix on 2 decimals]

        // +/-
        return (type === 'expense' ? '-':'+') + num;
    };

    // nodeListForEach is a self-define forEach function
    var nodeListForEach = function(list, callback) {
        for(var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    // everything inside this return{...} is exposed to outside
    return {
        // get user input data from a web page
        getInput: function() {
            // return an object containing the 3 user input data
            return {
                type:       document.querySelector(DOMStrings.typeName).value,      // will be either income or expense
                description:document.querySelector(DOMStrings.descriptionName).value,
                value:      parseFloat(document.querySelector(DOMStrings.valueName).value), // parseFloat convert text to float
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

            // placeHolder is a string to be added to HTML
            if(type === 'income') {
                element = DOMStrings.incomeContainer;
                placeHolder = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'expense') {
                element = DOMStrings.expenseContainer;
                placeHolder = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // replace placeHolder text with actual data
            var HTMLString = placeHolder.replace('%id%', obj.id);
            HTMLString = HTMLString.replace('%description%', obj.description);
            HTMLString = HTMLString.replace('%value%', formatNumber(obj.value, type));

            // insert HTML into DOM (display), use insertAdjacentHTML API
            document.querySelector(element).insertAdjacentHTML('beforeend', HTMLString);
        },

        // to delete an item from UI
        deleteListItem: function(itemID) {
            var item = document.getElementById(itemID);
            item.parentNode.removeChild(item);
        },

        // clear the user input boxes when after user clicks check button or press enter
        clearFields: function() {
            // querySelectorAll returns a list, so need to convert the list to array
            var fields = document.querySelectorAll(DOMStrings.descriptionName + ',' + DOMStrings.valueName);
            // convert to array, so we can loop the array
            var fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array) {
                current.value = '';
            });

            // focus back to description box
            fieldsArr[0].focus();
        },

        // update the total budget, total income/epense in UI
        displayBudget: function(obj) {
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, obj.budget < 0?'expense':'income');
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalIncome, 'income');
            document.querySelector(DOMStrings.expenseLabel).textContent = formatNumber(obj.totalExpense, 'expense');
            // to add % behind the number
            if(obj.percent > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percent + '%';
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            }
        },

        // update the percentages on each expense
        displayPercentages: function(allPercentages) {
            var fields = document.querySelectorAll(DOMStrings.expensePercentage);

            // exec nodeListForEach, for each element, do the function 
            nodeListForEach(fields, function(current, index) {
                if(allPercentages[index] > 0) {
                    current.textContent = allPercentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
        },

        // display month at the top
        displayMonth:   function() {
            var now = new Date();   // date of today
            var year = now.getFullYear();
            var month = now.getMonth();

            document.querySelector(DOMStrings.yearMonth).textContent = year + '-' + month;
        },

        // change color of input boxes and check button when user switch between + and -
        changeType: function() {
            var fields = document.querySelectorAll(
                DOMStrings.typeName +','+
                DOMStrings.descriptionName +','+
                DOMStrings.valueName);
            
            nodeListForEach(fields, function(cur) {
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DOMStrings.checkButtonName).classList.toggle('red');
        },

    };
})();

/**
 * Global app controller
 * controller takes budgetController and UIControl in, do something and update the 2 Controllers
 * do not use budgetController directly as input, instead give it a nickname (budgetCtrl)
 * in this way, we can separate budgetController (outside name) from budgetCtrl (inside name) in controller module
 * controller manages
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

        // setting up "X" button action for each expense/income item (event delegation)
        document.querySelector(DOM.itemContainer).addEventListener('click', ctrlDeleteItem);

        // set up event listener to change color 
        document.querySelector(DOM.typeName).addEventListener('change', UICtrl.changeType);
    };

    // after user add/delete new item, need to re-calculate the budget
    var updateBudget = function() {
        // tell budget controller to calculate the budget
        budgetCtrl.calcBudget();
        // get the newest budget from budget controller
        var curBudget = budgetCtrl.getBudget();     // curBudget is an obj with 4 elements
        console.log(curBudget);

        UICtrl.displayBudget(curBudget);
    };

    var updatePercentages = function() {
        // 1. calculate percentages
        budgetCtrl.calcPercentages();
        // 2. read percentage from budget controller
        var allPercentages = budgetCtrl.getPercentages();
        console.log(allPercentages);
        // 3. update UI
        UICtrl.displayPercentages(allPercentages);

    };

    var ctrlAddItem = function() {
        //This function does
        // * 1. get input data
        var input = UICtrl.getInput();          // calling UIController's method
        console.log(input);
        if (input.description == '' || isNaN(input.value)) {    // when missing a user input, do nothing
            console.log('Missing input data, not adding item.');
            return;
        }

        // * 2. add item to budget controller
        var newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        // * 3. add item to ui
        UICtrl.addListItem(newItem, input.type);
        UICtrl.clearFields();                   // after adding the item, clear user input boxes

        // * 4. calculate the budget
        // * 5. display budget on ui
        updateBudget();

        // 6. update percentage
        updatePercentages();

        console.log('adding item.')
    };

    // when delete button is clicked, this func runs
    var ctrlDeleteItem = function(event) {
        var itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        var splitID, type, ID;

        // if itemID exists
        if(itemID) {
            splitID = itemID.split('-');
            type    = splitID[0];
            ID      = parseInt(splitID[1]);        // need to convert to integer 
            console.log('   Delete on ' + type + ' :' + ID + ' is clicked');

            // 1. delete item from datastructure
            budgetCtrl.deleteItem(type, ID);
            // 2. delete item from UI
            UICtrl.deleteListItem(itemID);
            // 3. update new budget
            updateBudget();
            // 4. update percentage
            updatePercentages();
        }
    };  

    return {
        // public initialization function
        init:       function() {
            // call setup event listeners function
            setupEventListeners();

            UICtrl.displayMonth();

            // clear the numbers in html
            UICtrl.displayBudget({
                budget :        0,
                totalIncome:    0,
                totalExpense:   0,
                percent:        -1,
            });
        },
    }

})(budgetController, UIController);   

// calling the public initilization function here
controller.init();