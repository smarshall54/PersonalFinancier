// actual business logic for the financial model.

/*********************************************************************************************************
*
*		FINANCIAL OBJECT   "MODEL"
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


/****************************************************************************
	
	UserData object. Keeps up with user data entered on the page.

*****************************************************************************/	
function UserData(){ //targetValue, swr, usrCashFlow, usrExpenses, loanObjs, assetObjs, nloans, nassets
	this.targetValue = 0;
	this.swr = 0;
	this.usrCashFlow = 0;
	this.usrExpenses = 0;
	this.loanObjs = [];
	this.assetObjs = [];
	this.nloans = 0;
	this.nassets = 0;
	this.name = 'cookiemonster';
};
/****************************************************************************
	"MODEL" element
	should never call a "view" or "controller" function.
	controller only calls functions from model and gets the return data
*****************************************************************************/

function calcTimeseries(user){
	// takes a UserStats object as the input containing a user's complete financial info
	// returns time-series data for user's networth vs. month
	

	// unpack the user data
/*
	targetValue = user[0];
	swr = user[1];
	usrCashFlow = user[2];
	usrExpenses = user[3];
	loanObjArr = user[4];
	assetObjs = user[5];
*/
	networth = 490000;  // should grab this from the UI
						// 499k just for test


	console.log(user.loanObjs)


	// step 1 infinite loop check (cashflow > minpays, minpays big enough?)
	
	// is your cashflow bigger than all your minimum payments?
	var totalMinPay = 0; //initialize
	var payment = [];
	var period = 12; 	 // always just assume monthly compounding
	var minPayFlag = 0;
	var rates = [];

	//iterate over all the loan objects to get some important data.
	for (var x = 0; x<user.loanObjs.length; x++){

		// Validity Checks
		// Can you cashflow cover the min payments?
		totalMinPay = totalMinPay + user.loanObjs[x].minPay;  // this works, but FinObj.minPay returns a string.
														   // need to edit the function that stores it to be a number.
		// should set an error flag here and have a separate function for displaying form errors... 
		// 		same for below. but that is for another day.

		// Will the minpays ever get you out of debt?
		payment[x] = ((user.loanObjs[x].rate/100/period)*user.loanObjs[x].startValue)/(1-Math.pow((1+user.loanObjs[x].rate/100/period),-360));

		if (payment[x] > user.loanObjs[x].minPay){
			minPayFlag = 1;
		};

		rates[x] = user.loanObjs[x].rate;

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
	while(networth < user.targetValue) {
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

		console.log(user.loanObjs[0].timeValue)
		for (var x in user.loanObjs) {
			
			console.log('x this iter = '+x)
			console.log('loan min pay = '+user.loanObjs[x].minPay)

			user.loanObjs[x].pay(user.loanObjs[x].minPay);
			afterComp[x] = user.loanObjs[x].compound(period);

			console.log(afterComp[x])
		};
		console.log(user.loanObjs[0].timeValue)

		// loop step 3 - calculate networth (separate out equity?)


	// just some dummy outputs for now
	//var networth = [1000, 2000, 3000, 4000, s5000];

	return networth;
};