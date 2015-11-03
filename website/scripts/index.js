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
		this.pay = function(){};  	
		
		// method that compounds interest on this object at
		//		the end of the time period. modifies timeValue.
		this.compound = function(){}; 
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
	var $loanFields = '<tr id="'+newLoanId+'"><div id="'+newLoanId+'">'+'<td><input type="text" value="'+newLoanValue+'" id="'+newLoanId+'"Name" class="userStats"></td><td><input type="number" value=0 id="'+newLoanId+'Principal" class="userStats"></td><td><input type="number" value=0 id="'+newLoanId+'Rate" class="userStats"></td><td><input type="number" value=0 id="'+newLoanId+'Date" class="userStats"></td><td><input type="number" value=0 id="'+newLoanId+'MinPay" class="userStats"></td></div></tr>';


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
	var loanFieldRow = [];

	for (var y = 0; y<ntrack; y++){
		
		console.log(y)
		for (var x = 0; x<propNames.length; x++){

			loanFieldRow[x] = balanceType+y+propNames[x];

			// console.log(loanFieldRow[x]);
		};
		console.log('loanFieldRow');
		console.log(loanFieldRow);
		loanFieldNames[y] = loanFieldRow;
		console.log(loanFieldNames[y]);
	};

	console.log('loanFieldNames');
	console.log(loanFieldNames);

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

// calculate the results

// draw the graph

};

function parseData(){
	// reads in all of the data entered by the user
	// and creates necessary financial objects
	// Returns all of the user's Financial stats
	console.log('parsing data...');
	var userData = document.getElementsByTagName("div");
	console.log(userData.length);	

	targetValue = document.getElementById("targetValue").value;
	swr = document.getElementById("safeWithdrawRate").value;
	console.log('target portfolio value = '+targetValue);

	/*
	// get all inputs on the page (tag userStats)

	inputs = document.getElementsByTagName("userStats");

	// iterate over all the elements

	for (var i=0;i<inputs.length;i++){
	
	};

	*/

	assets = nameBalances('asset',countBalances('asset'));
	loans = nameBalances('loan',countBalances('loan'));

	console.log('assets array');
	console.log(assets);

	userData = "boogity";
	return userData;

};

function calcTimeseries(UserStats){
	// takes a UserStats object as the input containing a user's complete financial info
	// returns time-series data for user's networth vs. month
	var networth = [1000, 2000, 3000, 4000, 5000];

	return networth;
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