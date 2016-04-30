// all form data parsing

/*************************************************************************************************************************

"MODEL" element - it is doing form validation, formatting it for the algorithm, and getting ready to send it to the model. 

**************************************************************************************************************************/
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
