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
	
});