/*********************************************************************************************************
*
*		DOCUMENT ONLOAD  "CONTROLLER" element
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

/*********************************************************************************************************
*
*		FORM SUBMISSION
*
**********************************************************************************************************/


/* "CONTROLLER" elements - it is calling the model and telling the view to update */

function masterCalculate() {

	// first parse the form
	var nassets = countBalances('asset');
	var nloans = countBalances('loan');
	var userData = parseData(nassets,nloans);

	console.log('The Users data is:')
	console.log(userData)

	// calculate the results

	var results = calcTimeseries(userData);

	// draw the graph

	drawGraph(results);
	printResults(results);

};
