
$(document).ready(function(){
	$('div').fadeOut('slow');
});

var createLoanField = function(){

};

var finObj = {
	type: "loan", 		//"asset", "withdrawal", "windfall"
	name: "newLoan", 	// my loan name
	target: "newLoan",	// default "target account" to modify the value of.
						// 		in the case of a new loan or asset, the target
						//		is itself, as the new loan/asset creates a new
						// 		account. In the case of a Windfall or Withdrawal,
						// 		the target must be a different account that you
						// 		wish to deposit to or withdraw from
	startValue: 0,		// starting value of the object; in the case of a loan
						// 		or asset, this is the Principal amount
	rate: 0,			// interest rate of the financial object. could be
						// 		expected return, interest rate, or 0 for 
						//		windfalls and withdrawals.
						//		* would be interesting to add a feature to tie
						//			this to a variable (such as the Prime Rate)
						//			to support variable-rate loans.
	startDate: 0,		// the date on which the object applies. existing loans 
						// 		apply starting today, where a windfall might
						// 		occur 29 months in the future
	minPay: 0,			// the minimum payment you must make on this loan.
	payDate: 0,			// the contractual due date of this loan.
						// 		user can provide EITHER minpay or paydate and 
						// 		the object can calculate which one is needed
	timeValue: [],		// not user modified. this is calculated by the Algorithm
						// 		and will be an array of the value of this asset
						// 		at each time point in the simulation.
	pay: function(){};  // method that applies a payment to this object.
						// 		modifies timeValue.
	compound: function(){}; // method that compounds interest on this object at
						//		the end of the time period. modifies timeValue.
};