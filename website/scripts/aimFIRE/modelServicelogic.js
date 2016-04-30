// all form data parsing

/*************************************************************************************************************************

"MODEL" element - it is doing form validation, formatting it for the algorithm, and getting ready to send it to the model. 

**************************************************************************************************************************/
function parseData(userObject, nassets, nloans){
	// reads in all of the data entered by the user
	// and creates necessary financial objects
	// Returns all of the user's Financial stats
	


	console.log('parsing data...');

	tV = Number(document.getElementById("targetValue").value);
	rt = Number(document.getElementById("safeWithdrawRate").value);
	uCF = Number(document.getElementById("usrCashFlow").value);
	uEx = Number(document.getElementById("usrExpenses").value);

	console.log('target portfolio value = '+tV);
	console.log('usr SWR = '+rt);
	console.log('usr Cash Flow = '+uCF);
	console.log('usr Expenses = '+uEx);


	// names of the id fields that get inserted into HTML
	// are stored in "assetHtmlIds" and "loanHtmlIds"
	var assetHtmlIds = nameBalances('asset',nassets);
	var loanHtmlIds = nameBalances('loan',nloans);

	//console.log('assetHtmlIds array:');
	//console.log(assetHtmlIds);

	// retreive all data by ID and place into array containing a FinObj for each asset item.
	var aObjs = []; // initialize
	for (var assetNum = 0; assetNum<assetHtmlIds.length;assetNum++){
		
		aObjs[assetNum] = new FinObj()
		aObjs[assetNum].type = "asset";
		aObjs[assetNum].name = document.getElementById(assetHtmlIds[assetNum][0]).value;
		aObjs[assetNum].startValue = Number(document.getElementById(assetHtmlIds[assetNum][1]).value);
		aObjs[assetNum].rate = Number(document.getElementById(assetHtmlIds[assetNum][2]).value);
		aObjs[assetNum].startDate = Number(document.getElementById(assetHtmlIds[assetNum][3]).value);
		aObjs[assetNum].minPay = Number(document.getElementById(assetHtmlIds[assetNum][4]).value);

		console.log("the type of the object property minPay is ")
		console.log(typeof aObjs[assetNum].minPay)
	};

	//console.log(assetObjs)

	var lObjs = []; // initialize
	for (var loanNum = 0; loanNum<loanHtmlIds.length; loanNum++){
		
		lObjs[loanNum] = new FinObj()
		lObjs[loanNum].type = "loan";
		lObjs[loanNum].name = document.getElementById(loanHtmlIds[loanNum][0]).value;
		lObjs[loanNum].startValue = Number(document.getElementById(loanHtmlIds[loanNum][1]).value);
		lObjs[loanNum].rate = Number(document.getElementById(loanHtmlIds[loanNum][2]).value);
		lObjs[loanNum].startDate = Number(document.getElementById(loanHtmlIds[loanNum][3]).value);
		lObjs[loanNum].minPay = Number(document.getElementById(loanHtmlIds[loanNum][4]).value);
	};
		var test = lObjs[0].datArr(); // the method works! use obj.method() not just obj.method to call it.
	
	 //var userData = [targetValue, swr, usrCashFlow, usrExpenses, loanObjs, assetObjs];
	 userObject.targetValue = tV;
	 userObject.swr = rt;
	 userObject.usrCashFlow = uCF;
	 userObject.usrExpenses = uEx;
	 userObject.loanObjs = lObjs;
	 userObject.assetObjs = aObjs;
	
	return userObject;

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
