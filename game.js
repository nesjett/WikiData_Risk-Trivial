var AvailableRegions = ["BE","FR","BG","DK","HR","DE","BA","HU","JE","BY","GR","NL","PT","LI","LV","LT","LU","FO","PL","XK","CH","EE","IS","AL","IT","GG","CZ","GB","AX","IE","ES","ME","MD","RO","RS","MK","SK","MT","SI","SM","UA","AT"];
var UnavailableRegions = ["RU","SE","NO","AD","FI","IM"]; // To disable them from selection and color
var AutozoomRegions = ["VA","MC","SM","LI","MT","AD","LU","CY","XK","ME","GR","AL","MK"];
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

    if(!Number.isInteger(RegionsPerPlayer)) { // If not exact regions, give them randomly to last player to play
        Scores[Scores.length - 2].push(AvailableRegions.pop())
        Scores[Scores.length - 1].push(AvailableRegions.pop())
    }

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


function ChallengeRegion(Challenger, Challenged){

}

function AutoZoom(map, code){
    if(AutozoomRegions.indexOf(code) !== -1)
        FocusOnRegion(map, code);
}
function FocusOnRegion(map, code){
    map.setFocus({region: code, animate:true})
}
function UnFocus(map){
    map.setFocus({regions: ["PT","DK","EE","UA"], animate:true})
}

function PassTurn(){
    Turn++;
    if(Turn > NumPlayers-1)
        Turn = 0;
    return Turn;
}

function CanSelect(code){
    return Scores[Turn].indexOf(code) != -1
}


/**
 * Map event handlers
 */
function SelectRegion(event, code, isSelected, region){
    //if(!IsRegionEnabled(code)) // not needed here but onClick
     //   event.preventDefault()

    /*if(region.length == 0) {
        SelectedRegion = null;
    }else {
        if (SelectedRegion != null)
            ChallengeRegion(SelectedRegion, code)
        else
            SelectedRegion = code;
    }*/
    console.log(event)
    console.log(code)
    console.log(isSelected)
    console.log(region)

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


/**
 AJAX
 **/
function GetVecindades(pais){
    const endpointUrl = 'https://query.wikidata.org/sparql',
        sparqlQuery = `
    #fronteras de hungria Q28
    SELECT ?codLabel WHERE {
      ?pais wdt:P31 wd:Q6256.
      ?pais wdt:P17 wd:${pais}.
      ?pais wdt:P36 ?capital.
      ?pais wdt:P47 ?vecinos.
      ?vecinos wdt:P1813 ?cod
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
      
    }`,
        fullUrl = endpointUrl + '?query=' + encodeURIComponent( sparqlQuery ),
        headers = { 'Accept': 'application/sparql-results+json' };

    var vecinos = [];
    fetch( fullUrl, { headers } ).then( body => body.json() ).then( json => {
        const { head: { vars }, results } = json;
        for ( const result of results.bindings ) {
            for ( const variable of vars ) {
                vecinos.push(result[variable].value);
            }

        }
    } );

    return vecinos;

}