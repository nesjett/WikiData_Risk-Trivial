var AvailableRegions = ["BE","FR","BG","DK","HR","DE","BA","HU","JE","FI","BY","GR","NL","PT","LI","LV","LT","LU","FO","PL","XK","CH","EE","IS","AL","IT","GG","CZ","IM","GB","AX","IE","ES","ME","MD","RO","RS","MK","SK","MT","SI","SM","UA","AT"];
var UnavailableRegions = ["RU","SE","NO","AD"]; // To disable them from selection and color
var PlayerColors = ["#FF0C0C","#0C7AFF","#AAFF0C", "#e02aa9"]; // max number of players (4)
var NumPlayers = 3; // Number of players

var SelectionColor = "#FEFEFE";
var DisabledRegionColor = "#777777";

var Scores = new Array(NumPlayers);

var Turn = 0; // Current player turn


var SelectedRegion = null; // TODO: Necessary?


InitPlayers(); // Must be called BEFORE map creation

function InitPlayers(){
    ShuffleArray(AvailableRegions); // randomize player initial regions

    var RegionsPerPlayer = AvailableRegions.length / NumPlayers;
    if(!Number.isInteger(RegionsPerPlayer)) // If not exact regions, give them randomly to last player to play
        RegionsPerPlayer--;

    // Init scores to team number (asign initial regions to players)
    for(i = 0; i < NumPlayers; i++) {
        Scores[i] = [];
        for(j = 0; j < RegionsPerPlayer; j++)
            Scores[i].push(AvailableRegions.pop());
    }

    if(!Number.isInteger(RegionsPerPlayer)) // If not exact regions, give them randomly to last player to play
        Scores[Scores.length-1].push(AvailableRegions.pop())

    console.log(["Player regions (Scores):", Scores])
}

function DetermineRegionColors(){
    var Colors = {};

    for(i = 0; i < Scores.length; i++) { // all regions by players
        for(j = 0; j < Scores[i].length; j++)
            Colors[Scores[i][j]] = PlayerColors[i];
    }
    for(i = 0; i < Scores.length; i++) { // disabled regions
        Colors[UnavailableRegions[i]] = DisabledRegionColor;
    }

    return Colors;
}

function IsSameTeam(Turn, RegCode){
    return Scores[Turn].indexOf(String(RegCode)) !== -1;
}

function IsRegionEnabled(code){
    return UnavailableRegions.indexOf(String(code)) === -1;
}


function ChallengeRegion(){

}


/**
 * Map event handlers
 */
function SelectRegion(event, code, isSelected, region){
    //if(!IsRegionEnabled(code)) // not needed here but onClick
     //   event.preventDefault()

    if(region.length == 0)
        SelectedRegion = null;
    else
        SelectedRegion = code;
    console.log(event)
    console.log(code)
    console.log(isSelected)
    console.log(region)
    //ChallengeRegion()
}


/*************************************
 *
 * HELPERS
 *
 *
***************************************/


function ShuffleArray(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}