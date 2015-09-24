	function finObj(type,name,target,startValue,rate,startDate,minPay,payDate){
		
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

function addLoanField(){
	// creates a new set of text fields for a user to enter loan parameters.
	
	// simple test case
	console.log("adding loan field");
	//var $loanField = '<input type="text" value="Loan 1" id="loan1" class="userStats">';
	//$('#loans').append($loanField);

	// true code:
	// must go through all previous loan elements and determine the number/id of current loan
	// and then modify the DOM element string to have different values
	// ------
	var loanElem = document.getElementById('loans');
	
	// counts the # of direct child elements of 'loans' to know how many were already made
	var nloans = 0;
	for (var i=0; i<loanElem.childNodes.length;i++){
		var node = loanElem.childNodes[i];
		if (node.nodeType == Node.ELEMENT_NODE && node.nodeName == 'DIV' && node.id == 'loan'+nloans){
			nloans++;
		}
	}

	// names the new loan based on # of existing loans
	var newLoanId = 'loan'+nloans;
	var newLoanValue = 'Loan '+nloans;
	

	var $loanFields = '<div id="'+newLoanId+'">'+'<input type="text" value="'+newLoanValue+'" id="loan1Name" class="userStats"><input type="number" value=0 id="'+newLoanId+'Principal" class="userStats"><input type="number" value=0 id="'+newLoanId+'Rate" class="userStats"><input type="number" value=0 id="'+newLoanId+'Date" class="userStats"><input type="number" value=0 id="'+newLoanId+'minPay" class="userStats"></div>';

	$('#loans').append($loanFields);

};

function destroyLoanField(){
	// removes the last set of text fields created by the user

};

function parseData(){
	// reads in all of the data entered by the user
	// and creates necessary financial objects
};


$(document).ready(function(){
	
// just some fuckery to see if the doc loaded properly.
	$('h1').mouseover(function(){
		$(this).fadeOut('slow');
	});
	$('div').mouseleave(function(){
		$(this).fadeIn('slow');
	});
	
	$('#addLoan').click(addLoanField);
	
	$('#addAsset').click(addLoanField);

  var firstObj = new finObj();
  firstObj.name="betterName";
  console.log(firstObj.name);
});