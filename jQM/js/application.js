/* 
  jQuery Mobile Boilerplate
  application.js
*/
$(document).live("pageinit", function(event){

  $("#bx").on("change", function(e){
    var newConc = $("#bx").val()*$("#brixfactor").val();
    newConc = roundNumber(newConc,2)
    $("#concreq").val(newConc);
});
  
});

roundNumber(2.55343,2)
  
function roundNumber(number,decimal_points) {
  if(!decimal_points) return Math.round(number);
  if(number == 0) {
    var decimals = "";
    for(var i=0;i<decimal_points;i++) decimals += "0";
    return "0."+decimals;
  }

  var exponent = Math.pow(10,decimal_points);
  var num = Math.round((number * exponent)).toString();
  return num.slice(0,-1*decimal_points) + "." + num.slice(-1*decimal_points)
}  