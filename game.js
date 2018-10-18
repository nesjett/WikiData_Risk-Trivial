var AvailableRegions = ["BE","FR","BG","DK","HR","DE","BA","HU","JE","FI","BY","GR","NL","PT","LI","LV","LT","LU","FO","PL","XK","CH","AD","EE","IS","AL","IT","GG","CZ","IM","GB","AX","IE","ES","ME","MD","RO","RS","MK","SK","MT","SI","SM","UA","AT"];
var NumPlayers = 2; // Number of players

var SelectionColor = "#333333";

var Scores = new Array(NumPlayers);
// Init scores to team number
for(i = 0; i < NumPlayers; i++) {
    Scores[i] = [];
}

var Turn = 0; // Current player turn


var SelectedRegion = null;


function SelectRegion(event, code, isSelected, region){
    SelectedRegion = code;
    console.log(event)
    console.log(code)
    console.log(isSelected)
    console.log(region)
}

function ChallengeRegion(){

}