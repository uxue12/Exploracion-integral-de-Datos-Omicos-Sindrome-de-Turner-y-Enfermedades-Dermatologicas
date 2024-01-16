// (C) Wolfgang Huber 2010-2011

// Script parameters - these are set up by R in the function 'writeReport' when copying the 
//   template for this script from arrayQualityMetrics/inst/scripts into the report.

var highlightInitial = [ true, true, true, true, true, true, true, false, true, true, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true ];
var arrayMetadata    = [ [ "1", "GSM1411021.CEL", "XO", "red" ], [ "2", "GSM1411022.CEL", "XO", "red" ], [ "3", "GSM1411023.CEL", "XO", "red" ], [ "4", "GSM1411024.CEL", "XO", "red" ], [ "5", "GSM1411025.CEL", "XO", "red" ], [ "6", "GSM1411026.CEL", "XX", "blue" ], [ "7", "GSM1411027.CEL", "XX", "blue" ], [ "8", "GSM1411028.CEL", "XX", "blue" ], [ "9", "GSM1411029.CEL", "XX", "blue" ], [ "10", "GSM1411030.CEL", "XX", "blue" ], [ "11", "GSM1134016.CEL", "XX", "blue" ], [ "12", "GSM1134017.CEL", "XX", "blue" ], [ "13", "GSM1134018.CEL", "XX", "blue" ], [ "14", "GSM1134019.CEL", "XX", "blue" ], [ "15", "GSM1134020.CEL", "XX", "blue" ], [ "16", "GSM1134021.CEL", "XX", "blue" ], [ "17", "GSM1134022.CEL", "XX", "blue" ], [ "18", "GSM1134023.CEL", "XX", "blue" ], [ "19", "GSM1134024.CEL", "XX", "blue" ], [ "20", "GSM1134025.CEL", "XX", "blue" ], [ "21", "GSM1134026.CEL", "XO", "red" ], [ "22", "GSM1134027.CEL", "XO", "red" ], [ "23", "GSM1134028.CEL", "XO", "red" ], [ "24", "GSM1134029.CEL", "XO", "red" ], [ "25", "GSM1134030.CEL", "XO", "red" ], [ "26", "GSM1134031.CEL", "XO", "red" ], [ "27", "GSM1134032.CEL", "XO", "red" ], [ "28", "GSM1134033.CEL", "XO", "red" ], [ "29", "GSM1134034.CEL", "XO", "red" ], [ "30", "GSM1134035.CEL", "XO", "red" ], [ "31", "GSM1134036.CEL", "XO", "red" ], [ "32", "GSM1134037.CEL", "XO", "red" ], [ "33", "GSM1134038.CEL", "XO", "red" ], [ "34", "GSM1134039.CEL", "XO", "red" ], [ "35", "GSM1134040.CEL", "XO", "red" ], [ "36", "GSM1134041.CEL", "XO", "red" ], [ "37", "GSM1134042.CEL", "XO", "red" ], [ "38", "GSM1134043.CEL", "XO", "red" ], [ "39", "GSM1134044.CEL", "XO", "red" ], [ "40", "GSM1134045.CEL", "XO", "red" ], [ "41", "GSM1134046.CEL", "XO", "red" ], [ "42", "GSM1134047.CEL", "XO", "red" ], [ "43", "GSM1134048.CEL", "XO", "red" ], [ "44", "GSM1134049.CEL", "XO", "red" ], [ "45", "GSM1134050.CEL", "XO", "red" ], [ "46", "GSM1134051.CEL", "XO", "red" ] ];
var svgObjectNames   = [ "pca", "dens" ];

var cssText = ["stroke-width:1; stroke-opacity:0.4",
               "stroke-width:3; stroke-opacity:1" ];

// Global variables - these are set up below by 'reportinit'
var tables;             // array of all the associated ('tooltips') tables on the page
var checkboxes;         // the checkboxes
var ssrules;


function reportinit() 
{
 
    var a, i, status;

    /*--------find checkboxes and set them to start values------*/
    checkboxes = document.getElementsByName("ReportObjectCheckBoxes");
    if(checkboxes.length != highlightInitial.length)
	throw new Error("checkboxes.length=" + checkboxes.length + "  !=  "
                        + " highlightInitial.length="+ highlightInitial.length);
    
    /*--------find associated tables and cache their locations------*/
    tables = new Array(svgObjectNames.length);
    for(i=0; i<tables.length; i++) 
    {
        tables[i] = safeGetElementById("Tab:"+svgObjectNames[i]);
    }

    /*------- style sheet rules ---------*/
    var ss = document.styleSheets[0];
    ssrules = ss.cssRules ? ss.cssRules : ss.rules; 

    /*------- checkboxes[a] is (expected to be) of class HTMLInputElement ---*/
    for(a=0; a<checkboxes.length; a++)
    {
	checkboxes[a].checked = highlightInitial[a];
        status = checkboxes[a].checked; 
        setReportObj(a+1, status, false);
    }

}


function safeGetElementById(id)
{
    res = document.getElementById(id);
    if(res == null)
        throw new Error("Id '"+ id + "' not found.");
    return(res)
}

/*------------------------------------------------------------
   Highlighting of Report Objects 
 ---------------------------------------------------------------*/
function setReportObj(reportObjId, status, doTable)
{
    var i, j, plotObjIds, selector;

    if(doTable) {
	for(i=0; i<svgObjectNames.length; i++) {
	    showTipTable(i, reportObjId);
	} 
    }

    /* This works in Chrome 10, ssrules will be null; we use getElementsByClassName and loop over them */
    if(ssrules == null) {
	elements = document.getElementsByClassName("aqm" + reportObjId); 
	for(i=0; i<elements.length; i++) {
	    elements[i].style.cssText = cssText[0+status];
	}
    } else {
    /* This works in Firefox 4 */
    for(i=0; i<ssrules.length; i++) {
        if (ssrules[i].selectorText == (".aqm" + reportObjId)) {
		ssrules[i].style.cssText = cssText[0+status];
		break;
	    }
	}
    }

}

/*------------------------------------------------------------
   Display of the Metadata Table
  ------------------------------------------------------------*/
function showTipTable(tableIndex, reportObjId)
{
    var rows = tables[tableIndex].rows;
    var a = reportObjId - 1;

    if(rows.length != arrayMetadata[a].length)
	throw new Error("rows.length=" + rows.length+"  !=  arrayMetadata[array].length=" + arrayMetadata[a].length);

    for(i=0; i<rows.length; i++) 
 	rows[i].cells[1].innerHTML = arrayMetadata[a][i];
}

function hideTipTable(tableIndex)
{
    var rows = tables[tableIndex].rows;

    for(i=0; i<rows.length; i++) 
 	rows[i].cells[1].innerHTML = "";
}


/*------------------------------------------------------------
  From module 'name' (e.g. 'density'), find numeric index in the 
  'svgObjectNames' array.
  ------------------------------------------------------------*/
function getIndexFromName(name) 
{
    var i;
    for(i=0; i<svgObjectNames.length; i++)
        if(svgObjectNames[i] == name)
	    return i;

    throw new Error("Did not find '" + name + "'.");
}


/*------------------------------------------------------------
  SVG plot object callbacks
  ------------------------------------------------------------*/
function plotObjRespond(what, reportObjId, name)
{

    var a, i, status;

    switch(what) {
    case "show":
	i = getIndexFromName(name);
	showTipTable(i, reportObjId);
	break;
    case "hide":
	i = getIndexFromName(name);
	hideTipTable(i);
	break;
    case "click":
        a = reportObjId - 1;
	status = !checkboxes[a].checked;
	checkboxes[a].checked = status;
	setReportObj(reportObjId, status, true);
	break;
    default:
	throw new Error("Invalid 'what': "+what)
    }
}

/*------------------------------------------------------------
  checkboxes 'onchange' event
------------------------------------------------------------*/
function checkboxEvent(reportObjId)
{
    var a = reportObjId - 1;
    var status = checkboxes[a].checked;
    setReportObj(reportObjId, status, true);
}


/*------------------------------------------------------------
  toggle visibility
------------------------------------------------------------*/
function toggle(id){
  var head = safeGetElementById(id + "-h");
  var body = safeGetElementById(id + "-b");
  var hdtxt = head.innerHTML;
  var dsp;
  switch(body.style.display){
    case 'none':
      dsp = 'block';
      hdtxt = '-' + hdtxt.substr(1);
      break;
    case 'block':
      dsp = 'none';
      hdtxt = '+' + hdtxt.substr(1);
      break;
  }  
  body.style.display = dsp;
  head.innerHTML = hdtxt;
}
