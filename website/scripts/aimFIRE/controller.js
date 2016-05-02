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
	
	// initialize object containing user data
  	var user = new UserData();
  	console.log(user.swr)
  	console.log(user.name);

	// need to wrap a function in an anonymous function
	// if it has parameters, otherwise it will execute
	// the function on page load!
	$('#addLoan').click(function(){user.nloans = addLoanField('loan');
									console.log(user.nloans);});
	
	$('#addAsset').click(function(){user.nassets = addLoanField('asset');});
	
	$('#destroyLoan').click(function(){user.nloans = destroyLoanField('loan');});
	
	$('#destroyAsset').click(function(){user.nassets = destroyLoanField('asset');});

	$('#calculate').click(function(){
		user = masterCalculate(user);  // fucked up variable scope?
		console.log(user.name)
	});


});

/*********************************************************************************************************
*
*		FORM SUBMISSION
*
**********************************************************************************************************/


/* "CONTROLLER" elements - it is calling the model and telling the view to update */

function masterCalculate(userObj) {

	// first parse the form
	var nassets = countBalances('asset'); // really nassets and nloans should be properties that remain
	var nloans = countBalances('loan');   // updated in the model, and when the add/remove buttons are clicked,
	//var userData = 
	console.log(userObj)
	userObj = parseData(userObj,nassets,nloans); // the controller should just update those values in the model,
											// instead of counting them every time.

	console.log('The Users data is:')
	console.log(userObj)

	console.log('The Users Net Assets are:')
	console.log(userObj.netassets())

	console.log('The Users Net Loans are:')
	console.log(userObj.netloans())

	console.log('The Users Networth is: '+userObj.calcNw())

	// calculate the results

	//var results = 

	calcTimeseries(userObj);

	// draw the graph

	//drawGraph(results);
	//printResults(results);

	console.log(userObj);
	return userObj;
};
