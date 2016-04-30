/*********************************************************************************************************
*
*		FINANCIAL OBJECT
*
**********************************************************************************************************/

	function FinObj(type,name,target,startValue,rate,startDate,minPay,payDate){
		
		//"asset", "withdrawal", "windfall"
		this.type = "loan";

		// my loan name 			
		this.name = "newLoan"; 		

		// default "target account" to modify the value of.
		// 		in the case of a new loan or asset, the target
		//		is itself, as the new loan/asset creates a new
		// 		account. In the case of a Windfall or Withdrawal,
		// 		the target must be a different account that you
		// 		wish to deposit to or withdraw from
		this.target = "newLoan";		

		// starting value of the object; in the case of a loan
		// 		or asset, this is the Principal amount
		this.startValue = 0;			
		
		// interest rate of the financial object. could be
		// 		expected return, interest rate, or 0 for 
		//		windfalls and withdrawals.
		//		* would be interesting to add a feature to tie
		//			this to a variable (such as the Prime Rate)
		//			to support variable-rate loans.
		this.rate = 0;

		// the date on which the object applies. existing loans 
		// 		apply starting today, where a windfall might
		// 		occur 29 months in the future
		this.startDate = 0;		
		
		// the minimum payment you must make on this loan.
		this.minPay = 0;				
		
		// the contractual due date of this loan.
		// 		user can provide EITHER minpay or paydate and 
		// 		the object can calculate which one is needed
		this.payDate = 0;	

		// not user modified. this is calculated by the Algorithm
		// 		and will be an array of the value of this asset
		// 		at each time point in the simulation.
		this.timeValue = [];	

		// method that applies a payment to this object.
		// 		modifies timeValue.
		FinObj.prototype.pay = function(amount){

			var iter = this.timeValue.length + 1;

			if (this.timeValue.length == 0){
				this.timeValue[0] = this.startValue;
			}

			
			if (this.timeValue[iter-1]<amount) { 
				this.timeValue[iter] = 0;
				var remainder = amount - this.timeValue[iter-1];
			} else {
				this.timeValue[iter] = this.timeValue[iter-1] - amount;
				var remainder = 0;
			}
			
			return remainder;

		};  	
		
		// method that compounds interest on this object at
		//		the end of the time period. modifies timeValue.
		FinObj.prototype.compound = function(period){
			
					// FV = PV(1+r/n)^nt
			var A = this.timeValue[this.timeValue.length] * (1+this.rate/100/period)

			this.timeValue[this.timeValue.length] = A;
			
			return this.timeValue[this.timeValue.length];

		}; 

		// method that returns an array of all the properties of the loan.
		// it might not be possible to define a method inside the constructor function this way.
		//     how to do it? google!
		FinObj.prototype.datArr = function(){
			var datArr = [];
			datArr[0] = this.type;
			datArr[1] = this.name;
			datArr[2] = this.startValue;
			datArr[3] = this.rate;
			datArr[4] = this.startDate;

			return datArr;
		};
	};

/*********************************************************************************************************
*
*		DYNAMIC FORM MODIFICATION
*
**********************************************************************************************************/

function addLoanField(balanceType){
	// creates a new set of text fields for a user to enter loan parameters.


	var nloans = 0;
	var nassets = 0;
	// input validation
	// only 2 valid inputs: "loan" and "asset"
	if (balanceType==='loan') {
		var ntrack = nloans;
		console.log('detected loan type')

	} else if (balanceType==='asset'){
		var ntrack = nassets;
		console.log('detected asset type')
	} else {
		console.log('choose loan or asset to add.')
		return;
	}
	
	ntrack = countBalances(balanceType);

	// names the new loan based on # of existing loans
	var newLoanId = balanceType+ntrack;
	var newLoanValue = balanceType+' '+ntrack;
	
	// instead of this huge string, create a method under the finObj() called "createInputFields"
	// 		will also need "destroyInputFields" and "readInputFields"
	// function addLoanField should create a finObj that then creates its own fields and reads them in
	var $loanFields = '<tr id="'+newLoanId+'"><div id="'+newLoanId+'">'+'<td><input type="text" value="'+newLoanValue+'" id="'+newLoanId+'Name" class="userStats"></td><td><input type="number" value=0 id="'+newLoanId+'Principal" class="userStats"></td><td><input type="number" value=0 id="'+newLoanId+'Rate" class="userStats"></td><td><input type="number" value=0 id="'+newLoanId+'Date" class="userStats"></td><td><input type="number" value=0 id="'+newLoanId+'MinPay" class="userStats"></td></div></tr>';


	$('#'+balanceType+'Table').append($loanFields);

	if (balanceType=='loan') {
		nloans = ntrack;

	} else if (balanceType=='asset'){
		nloans = ntrack;
	} else {
		console.log('choose loan or asset to add.')
		return;
	}

};

function destroyLoanField(balanceType){
	// removes the last set of text fields created by the user

	var nloans = 0;
	var nassets = 0;
	// input validation
	// only 2 valid inputs: "loan" and "asset"
	if (balanceType==='loan') {
		var ntrack = nloans;
		console.log('detected loan type')

	} else if (balanceType==='asset'){
		var ntrack = nassets;
		console.log('detected asset type')
	} else {
		console.log('choose loan or asset to destroy.')
		return;
	}

	ntrack = countBalances(balanceType);

	ntrack--;

	// names the new loan based on # of existing loans
	var newLoanId = balanceType+ntrack;

	$("table#"+balanceType+"Table tr#"+newLoanId+"").empty();
	$("table#"+balanceType+"Table tr#"+newLoanId+"").remove();

};

/*********************************************************************************************************
*
*		SUBROUTINES
*
**********************************************************************************************************/

function countBalances(balanceType){
		// must go through all previous loan elements and determine the number/id of current loan
		// and then modify the DOM element string to have different values

		var ntrack = 0;
		var loanElem = document.getElementById(balanceType+'Table').getElementsByTagName("tbody")[0];
	
	// counts the # of direct child elements of 'balanceType' to know how many were already made
	// FUNCTIONALIZE into "countBalances" since it is used here and in addLoanField()

	for (var i=0; i<loanElem.childNodes.length;i++){
		var node = loanElem.childNodes[i];
		if (node.nodeType == Node.ELEMENT_NODE && node.nodeName == 'TR' && node.id == balanceType+ntrack){
			ntrack++;
		};
	};

	return ntrack;
 
};

function nameBalances(balanceType,ntrack){
	// reads in all balances of type balanceType. ntrack tells how many of each type there are.
	// returns [  ***************  ]

	// generate array of loan names
	// loan property field names
	// Name // Principal // Rate // Date // MinPay
	var propNames = ["Name","Principal","Rate","Date","MinPay"];
	
	// make an array of all the loan field IDs so we can use it later
	// to iterate over to collect all of the input values by ID
	var loanFieldNames = [];


	for (var y = 0; y<ntrack; y++){
		
		//console.log(y)

		var loanFieldRow = []; // initialize
		for (var x = 0; x<propNames.length; x++){

			loanFieldRow[x] = balanceType+y+propNames[x];

			// console.log(loanFieldRow[x]);
		};
		//console.log('loanFieldRow');
		//console.log(loanFieldRow);
		loanFieldNames[y] = loanFieldRow;
		//console.log('loanFieldNames['+y+']')
		//console.log(loanFieldNames[y]);
	};

	//console.log('loanFieldNames');
	//console.log(loanFieldNames);

	return loanFieldNames;

};

/*********************************************************************************************************
*
*		FORM SUBMISSION
*
**********************************************************************************************************/

function masterCalculate() {

// first parse the form
var userData = parseData();

console.log('The Users data is:')
console.log(userData)

// calculate the results

var results = calcTimeseries(userData);

// draw the graph

drawGraph(results);

};

function parseData(){
	// reads in all of the data entered by the user
	// and creates necessary financial objects
	// Returns all of the user's Financial stats
	


	console.log('parsing data...');

	targetValue = Number(document.getElementById("targetValue").value);
	swr = Number(document.getElementById("safeWithdrawRate").value);
	usrCashFlow = Number(document.getElementById("usrCashFlow").value);
	usrExpenses = Number(document.getElementById("usrExpenses").value);

	console.log('target portfolio value = '+targetValue);
	console.log('usr SWR = '+swr);
	console.log('usr Cash Flow = '+usrCashFlow);
	console.log('usr Expenses = '+usrExpenses);


	// names of the id fields that get inserted into HTML
	// are stored in "assetHtmlIds" and "loanHtmlIds"
	var assetHtmlIds = nameBalances('asset',countBalances('asset'));
	var loanHtmlIds = nameBalances('loan',countBalances('loan'));

	//console.log('assetHtmlIds array:');
	//console.log(assetHtmlIds);

	// retreive all data by ID and place into array containing a FinObj for each asset item.
	var assetObjs = []; // initialize
	for (var assetNum = 0; assetNum<assetHtmlIds.length;assetNum++){
		
		assetObjs[assetNum] = new FinObj()
		assetObjs[assetNum].type = "asset";
		assetObjs[assetNum].name = document.getElementById(assetHtmlIds[assetNum][0]).value;
		assetObjs[assetNum].startValue = Number(document.getElementById(assetHtmlIds[assetNum][1]).value);
		assetObjs[assetNum].rate = Number(document.getElementById(assetHtmlIds[assetNum][2]).value);
		assetObjs[assetNum].startDate = Number(document.getElementById(assetHtmlIds[assetNum][3]).value);
		assetObjs[assetNum].minPay = Number(document.getElementById(assetHtmlIds[assetNum][4]).value);

		console.log("the type of the object property minPay is ")
		console.log(typeof assetObjs[assetNum].minPay)
	};

	//console.log(assetObjs)

	var loanObjs = []; // initialize
	for (var loanNum = 0; loanNum<loanHtmlIds.length; loanNum++){
		
		loanObjs[loanNum] = new FinObj()
		loanObjs[loanNum].type = "loan";
		loanObjs[loanNum].name = document.getElementById(loanHtmlIds[loanNum][0]).value;
		loanObjs[loanNum].startValue = Number(document.getElementById(loanHtmlIds[loanNum][1]).value);
		loanObjs[loanNum].rate = Number(document.getElementById(loanHtmlIds[loanNum][2]).value);
		loanObjs[loanNum].startDate = Number(document.getElementById(loanHtmlIds[loanNum][3]).value);
		loanObjs[loanNum].minPay = Number(document.getElementById(loanHtmlIds[loanNum][4]).value);
	};
		var test = loanObjs[0].datArr(); // the method works! use obj.method() not just obj.method to call it.
var

	
	 userData = [targetValue, swr, usrCashFlow, usrExpenses, loanObjs, assetObjs];
	return userData;

};


function calcTimeseries(userData){
	// takes a UserStats object as the input containing a user's complete financial info
	// returns time-series data for user's networth vs. month
	

	// unpack the user data

	targetValue = userData[0];
	swr = userData[1];
	usrCashFlow = userData[2];
	usrExpenses = userData[3];
	loanObjArr = userData[4];
	assetObjs = userData[5];

	networth = 490000;  // should grab this from the UI
						// 499k just for test


	console.log(loanObjArr)


	// step 1 infinite loop check (cashflow > minpays, minpays big enough?)
	
	// is your cashflow bigger than all your minimum payments?
	var totalMinPay = 0; //initialize
	var payment = [];
	var period = 12; 	 // always just assume monthly compounding
	var minPayFlag = 0;
	var rates = [];

	//iterate over all the loan objects to get some important data.
	for (var x = 0; x<loanObjArr.length; x++){

		// Validity Checks
		// Can you cashflow cover the min payments?
		totalMinPay = totalMinPay + loanObjArr[x].minPay;  // this works, but FinObj.minPay returns a string.
														   // need to edit the function that stores it to be a number.
		// should set an error flag here and have a separate function for displaying form errors... 
		// 		same for below. but that is for another day.

		// Will the minpays ever get you out of debt?
		payment[x] = ((loanObjArr[x].rate/100/period)*loanObjArr[x].startValue)/(1-Math.pow((1+loanObjArr[x].rate/100/period),-360));

		if (payment[x] > loanObjArr[x].minPay){
			minPayFlag = 1;
		};

		rates[x] = loanObjArr[x].rate;

	};

	// console.log('Min Payments are: ')
	// console.log(payment)

	// write some form errors to the error box.
	var errMsgBox = document.getElementById("formErrMsg");
	errMsgBox.innerHTML = [];
	if (totalMinPay > usrCashFlow)	{
		errMsgBox.innerHTML += '<p>You do not have enough cash flow to get out of debt!</p>';
	}
	if (minPayFlag == 1) {
		errMsgBox.innerHTML += '<p>One of your loans will take > 30 years to pay off!</p>';
	}
	console.log("Total Minimum Payment is "+totalMinPay)

	// step 2 initialize loop

	// step 3 loop while networth < target portfolio value
	while(networth < targetValue) {
		// loop step 1 - sort for pay-down order

		console.log(rates)
		var avaRates = rates.slice(0);	// slice copies the array as a NEW ARRAY OBJECT. if you just do avaRates=rates, you are
										// essentially copying a pointer to the array and sorting one will sort "both" arrays.

		avaRates.sort( function(a,b) {
			return b-a;
		});

		var payOrder = [];
		for (var x = 0; x<avaRates.length;x++){
			payOrder[x] = rates.indexOf(avaRates[x]);
		};

		// can now iterate over payOrder to get the index of loanObjArr so that the right loans are paid first.

		console.log(payOrder)


		var monthTotal = 2000;

		networth += monthTotal;
		console.log('Networth this iter = '+networth)
	};

		// loop step 2 - pay down, accumulate interest

		var afterPay = [];  //initialize
		var afterComp = [];

		console.log(loanObjArr[0].timeValue)
		for (var x in loanObjArr) {
			
			console.log('x this iter = '+x)
			console.log('loan min pay = '+loanObjArr[x].minPay)

			loanObjArr[x].pay(loanObjArr[x].minPay);
			afterComp[x] = loanObjArr[x].compound(period);

			console.log(afterComp[x])
		};
		console.log(loanObjArr[0].timeValue)

		// loop step 3 - calculate networth (separate out equity?)


	// just some dummy outputs for now
	//var networth = [1000, 2000, 3000, 4000, s5000];

	return networth;
};

function drawGraph(results){
	console.log('I should be drawing a graph now.')
};
/*********************************************************************************************************
*
*		DOCUMENT ONLOAD
*
**********************************************************************************************************/

$(document).ready(function(){
	
// just some fuckery to see if the doc loaded properly.
	$('h1').mouseover(function(){
		$(this).fadeOut('slow');
	});
	$('h1').mouseleave(function(){
		$(this).fadeIn('slow');
	});
	

	// need to wrap a function in an anonymous function
	// if it has parameters, otherwise it will execute
	// the function on page load!
	$('#addLoan').click(function(){addLoanField('loan');});
	
	$('#addAsset').click(function(){addLoanField('asset');});
	
	$('#destroyLoan').click(function(){destroyLoanField('loan');});
	
	$('#destroyAsset').click(function(){destroyLoanField('asset');});

	$('#calculate').click(masterCalculate);

  var firstObj = new FinObj();
  firstObj.name="betterName";
  console.log(firstObj.name);
});