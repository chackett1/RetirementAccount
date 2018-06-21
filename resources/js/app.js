var model = (function() {
    
    var exampleData = {
        moneyA: [],
        moneyB: [],
        moneyC: []
    };
    
    var companyMatchData = {
        moneyA: [],
        moneyB: []
    };    
    
    var planData = {
        money: [],
        firstChartFlag: true
    };   
    
    var budgetData = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        ids: []
    };
    
    var BudgetExpense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var BudgetIncome = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var budgetCalculateTotal = function(type) {
        
        var sum = 0;
        budgetData.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });
        budgetData.totals[type] = sum;
    };
    
    return {
        exampleCalculations: function() {
            
            var i;
            for (i = 0; i <= 10; i = i + 1) {
                exampleData.moneyA[i] = 0;
            }
            for (i = 11; i <= 45; i = i + 1) {
                exampleData.moneyA[i] = 4000 + exampleData.moneyA[i - 1] * 1.085;
            }

            exampleData.moneyB[0] = 0;            
            for (i = 1; i <= 10; i = i + 1) {
                exampleData.moneyB[i] = 4000 + exampleData.moneyB[i - 1] * 1.085;
            }
            for (i = 11; i <= 45; i = i + 1) {
                exampleData.moneyB[i] = exampleData.moneyB[i - 1] * 1.085;
            }

            exampleData.moneyC[0] = 0;            
            for (i = 1; i <= 4; i = i + 1) {
                exampleData.moneyC[i] = 10000 + exampleData.moneyC[i - 1] * 1.085;
            }

            for (i = 5; i <= 45; i = i + 1) {
                exampleData.moneyC[i] = exampleData.moneyC[i - 1] * 1.085;
            }
        },
        
        companyMatchCalculations: function() {
            
            var i;
            companyMatchData.moneyA[0] = 0;
            companyMatchData.moneyB[0] = 5000;
            
            for (i = 1; i <= 10; i = i + 1) {
                companyMatchData.moneyA[i] = 3200 + companyMatchData.moneyA[i - 1] * 1.085;
                companyMatchData.moneyB[i] = 3200 + companyMatchData.moneyB[i - 1] * 1.085;
            }
            for (i = 11; i <= 20; i = i + 1) {
                companyMatchData.moneyA[i] = 4000 + companyMatchData.moneyA[i - 1] * 1.085;
                companyMatchData.moneyB[i] = 4000 + companyMatchData.moneyB[i - 1] * 1.085;
            }
            for (i = 21; i <= 30; i = i + 1) {
                companyMatchData.moneyA[i] = 4800 + companyMatchData.moneyA[i - 1] * 1.085;
                companyMatchData.moneyB[i] = 4800 + companyMatchData.moneyB[i - 1] * 1.085;
            }
            for (i = 31; i <= 40; i = i + 1) {
                companyMatchData.moneyA[i] = 5600 + companyMatchData.moneyA[i - 1] * 1.085;
                companyMatchData.moneyB[i] = 5600 + companyMatchData.moneyB[i - 1] * 1.085;
            }
        },        

        planCalculations: function(yearlyDeposits, startYear, endYear) {
            
            // Fill money array from start year to end year
            for (var i = Number(startYear); i <= Number(endYear); i++) {
                planData.money[i] = Number(yearlyDeposits) + Number(planData.money[i-1]) * 1.085;
            }

            // Sleep Timer for chart animation
            var i = Number(startYear);
            function timerLoop () {
                setTimeout(function () {
                    // Add Data Function Call
                    view.planAddData(i);
                    i++;
                    if (i <= Number(endYear)) {
                        timerLoop();
                    }
                }, 80)
            }
            timerLoop();
        },
        
        addItemToBudget: function(type, des, val) {
            
            var newItem, ID;
            
            // Create new ID
            if (budgetData.allItems[type].length > 0) {
                ID = budgetData.allItems[type][budgetData.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            
            // Create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new BudgetExpense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new BudgetIncome(ID, des, val);
            }
            
            // Push it into the data structure
            budgetData.allItems[type].push(newItem);
            
            // Add the id to the array of ids
            if(type === 'inc') {
                budgetData.ids.push('inc-' + ID);
            }
            else if(type === 'exp') {
                budgetData.ids.push('exp-' + ID);
            }
            
            // Return the new element
            return newItem;
        },
        
        deleteItemFromBudget: function(type, id) {
            
            var ids, index;
            
            // Map of all ids
            ids = budgetData.allItems[type].map(function(current) {
                return current.id;
            });
            
            // Find index of current id
            index = ids.indexOf(id);

            // Remove ID from allItems data structure
            if (index !== -1) {
                budgetData.allItems[type].splice(index, 1);
            }
            
            // Remove ID from IDs array
            budgetData.ids.pop();
        },
        
        calculateBudget: function() {
            
            // calculate total income and expenses
            budgetCalculateTotal('exp');
            budgetCalculateTotal('inc');
            
            // Calculate the budget: income - expenses
            budgetData.budget = budgetData.totals.inc - budgetData.totals.exp;
        },        
        
        getBudget: function() {            
            return {
                budget: budgetData.budget,
                totalInc: budgetData.totals.inc,
                totalExp: budgetData.totals.exp
            };
        },        
        getLastID: function() {
            return budgetData.ids[budgetData.ids.length - 1];
        },        
        getIDsLength: function() {
            return budgetData.ids.length;
        },        
        getExampleA: function() {
            return exampleData.moneyA;
        },        
        getExampleB: function() {
            return exampleData.moneyB;
        },        
        getExampleC: function() {
            return exampleData.moneyC;
        },        
        getMatchA: function() {
            return companyMatchData.moneyA;
        },        
        getMatchB: function() {
            return companyMatchData.moneyB;
        },        
        getFirstChartFlag: function() {
            return planData.firstChartFlag;
        },        
        setFirstChartFlag: function(flag) {
            planData.firstChartFlag = flag;
        },        
        getPlanMoney: function(index) {
            return planData.money[index];
        },        
        setPlanMoney: function(index, value) {
            planData.money[index] = value;
        }
    };    
})();

var view = (function() {
    
    var DOMstrings = {
        initialDepositInput: '#initialDeposit',
        yearlyDepositInput: '#yearlyDeposits',
        startYearInput: '#startYear',
        endYearInput: '#endYear',
        planAddDataBtn: '#planAddData',
        planRemoveChartBtn: '#planRemoveDataset',
        
        typeInput: '#type',
        descriptionInput: '#description',
        amountInput: '#amount',
        budgetAddDataBtn: '#budgetAddData',
        budgetRemoveDataBtn: '#budgetRemoveData',
        budgetRemoveAllDataBtn: '#budgetRemoveAllData',
        incomeContainer: '.income-list',
        expenseContainer: '.expense-list',
        budgetLabel: '.box-budget',
        incomeLabel: '.income-total',
        expensesLabel: '.expense-total'
    };
    
    var planConfig;
    
    var colors = {
        greenShade: 0,
        redShade: 0
    };
    
    var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };
    
    var configBudget = {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [	],
                backgroundColor: [ ],
                label: ''
            }],
            labels: [ ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: ''
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    };
    
    var allChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        title: {
            display: true,
            text: 'Retirement Account with 8.5% Return'
        },
        tooltips: {
            mode: 'index',
            intersect: false,
            callbacks: {
                label: function (tooltipItem, data) {
                    var label = data.datasets[tooltipItem.datasetIndex].label || '';

                    if (label) {
                        label += ': ';
                    }
                    label += Math.round(tooltipItem.yLabel);
                    return label;
                }
            }
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Years'
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Dollars'
                }
            }]
        }
    };
    
    return {
        exampleDrawChart: function(dataA, dataB, dataC) {
            
            var ctx = document.getElementById('examplesChart').getContext('2d');
            var chart = new Chart(ctx, {
                type: 'line',
                options: allChartOptions,
                data: {
                    labels: ["20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", "61", "62", "63", "64", "65"],
                    datasets: [{
                        label: "Person A",
                        borderColor: '#e74c3c',
                        data: dataA
                    }, {
                        label: "Person B",
                        borderColor: '#8e44ad',
                        data: dataB
                    }, {
                        label: "Person C",
                        borderColor: '#3498db',
                        data: dataC
                    }]
                }
            });
        },
        
        companyMatchDrawChart: function(dataA, dataB) {
        
            var ctx = document.getElementById('matchChart').getContext('2d');
            var chart = new Chart(ctx, {
                type: 'line',
                options: allChartOptions,
                data: {
                    labels: ["25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", "61", "62", "63", "64", "65"],
                    datasets: [{
                        label: "Person A",
                        borderColor: '#e67e22',
                        data: dataA
                    }, {
                        label: "Person B",
                        borderColor: '#27ae60',
                        data: dataB
                    }]
                }
            });
        },
        
        planDrawChart: function() {

            planConfig = {
                type: 'line',
                options: allChartOptions,
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Custom Data',
                        backgroundColor: 'rgb(20, 255, 20)',
                        borderColor: '#20bf6b',
                        data: [],
                        fill: false,
                    }]
                }
            };            
            var ctx = document.getElementById('tryItYourselfChart').getContext('2d');
            window.myLine = new Chart(ctx, planConfig);
        },
        
        planUpdateFields: function(endYear) {
            
            // Clear fields
            var fields, fieldsArr;            
            fields = document.querySelectorAll(DOMstrings.yearlyDepositInput + ', ' + DOMstrings.endYearInput);            
            fieldsArr = Array.prototype.slice.call(fields);            
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });            
            fieldsArr[0].focus();
            
            // Update start year
            nextYear = endYear + 1;
            document.querySelector(DOMstrings.startYearInput).value = nextYear;
            document.querySelector(DOMstrings.startYearInput).setAttribute("placeholder", nextYear);
            
            // Add read only to start year and initial deposit to prevent errors
            document.querySelector(DOMstrings.initialDepositInput).setAttribute("readonly", "true");            
            document.querySelector(DOMstrings.startYearInput).setAttribute("readonly", "true");
        },
        
        planResetFields: function(DOM) {
            
            // Clear fields
            document.querySelector(DOM.startYearInput).value = "";
            document.querySelector(DOM.startYearInput).setAttribute("placeholder", "");
            document.querySelector(DOM.yearlyDepositInput).value = "";
            document.querySelector(DOM.endYearInput).value = "";
            document.querySelector(DOM.initialDepositInput).value = "0";

            // Remove read only
            document.querySelector(DOM.initialDepositInput).removeAttribute("readonly");
            document.querySelector(DOM.startYearInput).removeAttribute("readonly");
        },
        
        planRemoveChart: function(DOM) {
            
            // Remove chart
            var elem = document.getElementById('tryItYourselfChart'); 
            elem.parentNode.removeChild(elem);

            // Remove div
            var para = document.createElement("canvas");
            var element = document.getElementById("tryItYourselfDiv");
            
            // Add div back in
            element.appendChild(para);        
            document.getElementsByTagName("canvas")[2].id="tryItYourselfChart";
        },
        
        planAddData: function(index) {
            
            // Add label to chart
            planConfig.data.labels.push(index);

            // Add value to label
            planConfig.data.datasets.forEach(function(dataset) {
                dataset.data.push(model.getPlanMoney(index));
            });
            window.myLine.update();
        },
        
        planGetInput: function() {            
            return {
                initialDeposit: parseFloat(document.querySelector(DOMstrings.initialDepositInput).value),
                yearlyDeposit: parseFloat(document.querySelector(DOMstrings.yearlyDepositInput).value),
                startYear: parseFloat(document.querySelector(DOMstrings.startYearInput).value),
                endYear: parseFloat(document.querySelector(DOMstrings.endYearInput).value)
            };
        },

        budgetDrawChart: function() { 

            var ctx = document.getElementById('budgetChart').getContext('2d');
            window.myDoughnut = new Chart(ctx, configBudget);
        },
        
        budgetGetInput: function() {
            return {
                type: document.querySelector(DOMstrings.typeInput).value,
                description: document.querySelector(DOMstrings.descriptionInput).value,
                value: parseFloat(document.querySelector(DOMstrings.amountInput).value)
            };
        },      
        
        budgetDisplay: function(obj) {            
            document.querySelector(DOMstrings.budgetLabel).textContent = '$' + obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = 'Total Income $' + obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = 'Total Expenses $' + obj.totalExp;            
        },
        
        budgetClearFields: function() {
            
            var fields, fieldsArr;
            
            // Locator for description and amount inputs
            fields = document.querySelectorAll(DOMstrings.descriptionInput + ', ' + DOMstrings.amountInput);
            
            // Move into selection into array
            fieldsArr = Array.prototype.slice.call(fields);
            
            // Remove value from input
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });
            
            // Select first input box
            fieldsArr[0].focus();
        },  
        
        budgetAddListItem: function(obj, type) {
            
            var html, newHtml, element;
            
            // Create HTML string            
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;                
                html = '<p id="inc-%id%">%description% $%value%</p>';
            } 
            else if (type === 'exp') {
                element = DOMstrings.expenseContainer;                
                html = '<p id="exp-%id%">%description% $%value%</p>';
            }
            
            // Add actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            
            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },        
        
        budgetDeleteListItem: function(selectorID) {
            
            // Remove item from budget list
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);            
        },
        
        budgetAddDataToChart: function(type, description, value) {
            
            if (configBudget.data.datasets.length > 0) {
                
                // Add label to chart
                configBudget.data.labels.push(description);

                configBudget.data.datasets.forEach(function(dataset) {     
                    
                    // Add value to label
                    dataset.data.push(value);  

                    // Add color to label
                    if( type === 'inc')
                    { 
                        if(colors.greenShade < 145)
                        {
                            colors.greenShade = 230;
                        }
                        // Green for increment
                        dataset.backgroundColor.push('rgba(0, ' + colors.greenShade + ', 0)');
                        colors.greenShade -= Number('20');
                    }
                    else
                    { 
                        if(colors.redShade < 145)
                        {
                            colors.redShade = 230;
                        }
                        // Red for decrement
                        dataset.backgroundColor.push('rgba(' + colors.redShade + ', 0, 0)');
                        colors.redShade -= Number('20');
                    }
                });            
                window.myDoughnut.update();
            }
        },
        
        budgetRemoveDataFromChart: function(type, description, value) {
            
            // Remove Label
            configBudget.data.labels.splice(-1, 1);

            // Remove value
            configBudget.data.datasets.forEach(function(dataset) {
                dataset.data.pop();
                dataset.backgroundColor.pop();
            });
            window.myDoughnut.update();
        },
        
        budgetChangeType: function() {
            
            // Locator for type description and amount
            var fields = document.querySelectorAll(
                DOMstrings.typeInput + ',' +
                DOMstrings.descriptionInput + ',' +
                DOMstrings.amountInput);      
            
            // If decrement is selected add red border to the focused box
            nodeListForEach(fields, function(cur) {
                cur.classList.toggle('green-focus');
                cur.classList.toggle('red-focus');
            });
        },
            
        getDOMstrings: function() {
            return DOMstrings;
        }
    };
})();

var controller = (function(modelCtrl, viewCtrl) {

    var setupListeners = function() {
        var DOM = viewCtrl.getDOMstrings();
        
        // Create a plan listeners
        document.querySelector(DOM.planAddDataBtn).addEventListener('click', planAddData); 
        document.querySelector(DOM.planRemoveChartBtn).addEventListener('click', planRemoveChart); 

        // Create a budget listeners
        document.querySelector(DOM.typeInput).addEventListener('change', viewCtrl.budgetChangeType);
        document.querySelector(DOM.budgetAddDataBtn).addEventListener('click', budgetAddData);
        document.querySelector(DOM.budgetRemoveDataBtn).addEventListener('click', budgetDeleteItem);        
        document.querySelector(DOM.budgetRemoveAllDataBtn).addEventListener('click', controller.init);  
        
        // Add item by pressing enter to plan or budget
        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                planAddData();
                budgetAddData();
            }
        });
    };
    
    var planAddData = function() {
        
        // Get the input data
        input = viewCtrl.planGetInput();
        
        // Check if input is valid
        if(input.yearlyDeposit >= 0 && input.initialDeposit >= 0 && input.endYear > input.startYear) {
        
            // Check if the chart has been created
            var firstChartFlag = modelCtrl.getFirstChartFlag();
            if(firstChartFlag == true) {
            
            // Create chart
            viewCtrl.planDrawChart();

            // Update chart flag
            modelCtrl.setFirstChartFlag(false);

            // Add initial deposit to data structure
            modelCtrl.setPlanMoney(input.startYear, input.initialDeposit);

            // Add initial deposit chart
            viewCtrl.planAddData(input.startYear);
                
            // Increment start year
            input.startYear++;
        }
        // Add input data to chart    
        modelCtrl.planCalculations(input.yearlyDeposit, input.startYear, input.endYear);

        // Update input fields
        viewCtrl.planUpdateFields(input.endYear);
        }
    };
    
    var planRemoveChart = function() {
        
        // Check if chart is present
        if(!modelCtrl.getFirstChartFlag()) {
        
            // Get DOM strings
            var DOM = viewCtrl.getDOMstrings();

            // Clear input fields
            viewCtrl.planResetFields(DOM);

            // Remove chart
            viewCtrl.planRemoveChart();

            // Update chart flag
            modelCtrl.setFirstChartFlag(true);            
        }
    };
    
    var updateBudget = function() {
        
        // Calculate the budget
        modelCtrl.calculateBudget();
        
        // Return the budget
        var budget = modelCtrl.getBudget();
        
        // Display the budget on the UI
        viewCtrl.budgetDisplay(budget);
    };
    
    var budgetAddData = function() {
        var input, newItem;
        
        // Get the field input data
        input = viewCtrl.budgetGetInput();
        
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            
            // Add the item to the budget controller
            newItem = modelCtrl.addItemToBudget(input.type, input.description, input.value);

            // Add the item to the UI
            viewCtrl.budgetAddListItem(newItem, input.type);

            // Clear the fields
            viewCtrl.budgetClearFields();

            // Calculate and update budget
            updateBudget();
            
            // Add item to doughnut chart
            viewCtrl.budgetAddDataToChart(input.type, input.description, input.value);
            
        }
    };    
    
    var budgetDeleteItem = function() {
        var itemID, splitID, type, ID;
        
        // Get the ID
        itemID = modelCtrl.getLastID();
        
        if (itemID) {
            
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            
            // Delete the item from the data structure
            modelCtrl.deleteItemFromBudget(type, ID);
            
            // Delete the item from the UI
            viewCtrl.budgetDeleteListItem(itemID);
            
            // Update and show the new budget
            updateBudget();
            
            // Remove item from doughnut chart
            viewCtrl.budgetRemoveDataFromChart();
        }
    };
    
    return {
        // Called from JQuery file for animation
        createExampleChart: function() {

            // 1. Calculate retirement accounts
            modelCtrl.exampleCalculations();

            // 2. Get retirement account arrays
            var moneyA = modelCtrl.getExampleA();
            var moneyB = modelCtrl.getExampleB();
            var moneyC = modelCtrl.getExampleC();

            // 3. Draw Expodential Growth Examples Chart
            viewCtrl.exampleDrawChart(moneyA, moneyB, moneyC);
        },

        // Called from JQuery file for animation
        createCompanyMatchChart: function() {

            // 1. Calculate retirement accounts
            modelCtrl.companyMatchCalculations();

            // 2. Get retirement account arrays
            var moneyA = modelCtrl.getMatchA();
            var moneyB = modelCtrl.getMatchB();

            // 3. Draw Company Match Chart
            viewCtrl.companyMatchDrawChart(moneyA, moneyB);
        },
            
        init: function() {            
            
            setupListeners();
            
            viewCtrl.budgetDrawChart();
            
            while(modelCtrl.getIDsLength() > 0) {
                budgetDeleteItem();
            }
            
            viewCtrl.budgetDisplay({
                budget: 0,
                totalInc: 0,
                totalExp: 0
            });
        }
    };
    
})(model, view);

controller.init();
