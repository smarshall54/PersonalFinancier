/*********************************************************************************************************
*
*		DYNAMIC FORM MODIFICATION   "VIEW"
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
	return ntrack;
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

	return ntrack;

};


/*********************************************************************************************************
*
*		SUBROUTINES  "VIEW"
*
**********************************************************************************************************/


// move this function into model and call it everytime the controller updates the # of fields
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

// "VIEW" element

function printResults(results){
	//console.log(results);
	document.getElementById("printPane").innerHTML = results;

};


function drawGraph(results){
	//console.log('I should be drawing a graph now.');
	document.getElementById("graphPane").innerHTML = 'This Should be a Graph!';
};