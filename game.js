var AvailableRegions = ["BE","FR","BG","DK","HR","DE","BA","HU","JE","BY","GR","NL","PT","LI","LV","LT","LU","FO","PL","XK","CH","EE","IS","AL","IT","GG","CZ","GB","AX","IE","ES","ME","MD","RO","RS","MK","SK","MT","SI","SM","UA","AT"];
var AvailableRegionsID = ["Q31","Q142","Q219","Q35","Q224","Q183","Q225","Q28","Q785","Q184","Q41","Q55","Q45","Q347","Q211","Q37","Q32","Q4628","Q36","Q1246","Q39","Q191","Q189","Q222","Q38","Q25230","Q213","Q145","Q27","Q29","Q236","Q217","Q218","Q403","Q221","Q214","Q233","Q215","Q238","Q212","Q40"];

var UnavailableRegions = ["RU","SE","NO","AD","FI","IM"]; // To disable them from selection and color
var AutozoomRegions = ["VA","MC","SM","LI","MT","AD","LU","CY","XK","ME","GR","AL","MK"];
var PlayerColors = ["#FF0C0C","#0C7AFF","#AAFF0C", "#e02aa9"]; // max number of players (4)
var BlockedRegions = []; // Temporal to store which countries this player already used to attack, resseted on every turn beggining
var NumPlayers = 4; // Number of players

var SelectionColor = "#FFFFFF";
var DisabledRegionColor = "#777777";

var Scores = new Array(NumPlayers);
var Resources = new Array(NumPlayers);

var Turn = 0; // Current player turn
var gChallenger = null;
var gChallenged = null;


var SelectedRegion = null; // currently selected region


InitPlayers(); // Must be called BEFORE map creation

function InitPlayers(){
    var RegionsCopy = AvailableRegions.slice(0); // duplicate array to maintain original data
    ShuffleArray(RegionsCopy); // randomize player initial regions

    var RegionsPerPlayer = RegionsCopy.length / NumPlayers;
    if(!Number.isInteger(RegionsPerPlayer)) // If not exact regions, give them randomly to last player to play
        RegionsPerPlayer--;

    // Init scores to team number (asign initial regions to players)
    for(i = 0; i < NumPlayers; i++) {
        Scores[i] = [];
        Resources[i] = [];
        for(j = 0; j < RegionsPerPlayer; j++) {
            Scores[i].push(RegionsCopy.pop());
            Resources[i].push(GetRandomInt(1,10));
        }
    }

    if(!Number.isInteger(RegionsPerPlayer)) { // If not exact regions, give them randomly to last player to play
        Scores[Scores.length - 2].push(RegionsCopy.pop())
        Resources[Resources.length - 2].push(GetRandomInt(1,10))
        Scores[Scores.length - 1].push(RegionsCopy.pop())
        Resources[Resources.length - 1].push(GetRandomInt(1,10))
    }

    console.log(["Player regions (Scores):", Scores])
    console.log(["Player resources (Resources):", Resources])
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

function GetMarkerData(){
    var marks = [
        {name: 'VAK', coords: [50.0091294, 9.0371812], status: 'closed', offsets: [0, 2]},
        {name: 'MZFR', coords: [49.0543102, 8.4825862], status: 'closed', offsets: [0, 2]},
        {name: 'AVR', coords: [50.9030599, 6.4213693], status: 'closed'},
        {name: 'KKR', coords: [53.1472465, 12.9903674], status: 'closed'},
        {name: 'KRB', coords: [48.513264, 10.4020357], status: 'activeUntil2018'},
        {name: 'KWO', coords: [49.364503, 9.076252], status: 'closed'},
        {name: 'KWL', coords: [52.5331853, 7.2505223], status: 'closed', offsets: [0, -2]},
        {name: 'HDR', coords: [50.1051446, 8.9348691], status: 'closed', offsets: [0, -2]},
        {name: 'KKS', coords: [53.6200685, 9.5306289], status: 'closed'},
        {name: 'KKN', coords: [48.6558015, 12.2500848], status: 'closed', offsets: [0, -2]},
        {name: 'KGR', coords: [54.1417497, 13.6583877], status: 'closed'},
        {name: 'KWB', coords: [49.709331, 8.415865], status: 'closed'},
        {name: 'KWW', coords: [51.6396481, 9.3915617], status: 'closed'},
        {name: 'GKN', coords: [49.0401151, 9.1721088], status: 'activeUntil2022'},
        {name: 'KKB', coords: [53.8913533, 9.2005777], status: 'closed', offsets: [0, -5]},
        {name: 'KKI', coords: [48.5544748, 12.3472095], status: 'activeUntil2022', offsets: [0, 2]},
        {name: 'KKU', coords: [53.4293465, 8.4774649], status: 'closed'},
        {name: 'KNK', coords: [49.1473279, 8.3827739], status: 'closed'},
        {name: 'KKP', coords: [49.2513078, 8.4356761], status: 'activeUntil2022', offsets: [0, -2]},
        {name: 'KKG', coords: [49.9841308, 10.1846373], status: 'activeUntil2018'},
        {name: 'KKK', coords: [53.4104656, 10.4091597], status: 'closed'},
        {name: 'KWG', coords: [52.0348748, 9.4097793], status: 'activeUntil2022'},
        {name: 'KBR', coords: [53.850666, 9.3457603], status: 'closed', offsets: [0, 5]},
        {name: 'KMK', coords: [50.408791, 7.4861956], status: 'closed'},
        {name: 'THTR', coords: [51.6786228, 7.9700232], status: 'closed'},
        {name: 'KKE', coords: [52.4216974, 7.3706389], status: 'activeUntil2022', offsets: [0, 2]}
    ];
    return marks;
}

function IsSameTeam(Turn, RegCode){
    return Scores[Turn].indexOf(String(RegCode)) !== -1;
}

function IsRegionEnabled(code){
    return UnavailableRegions.indexOf(String(code)) === -1;
}

function IsRegionBlocked(code){
    return UnavailableRegions.indexOf(String(code)) === -1;
}

function GetIdFromShortcode(code){
    if(AvailableRegions.indexOf(code) !== -1)
        return AvailableRegionsID[AvailableRegions.indexOf(code)];
    else
        return null;
}

function GetPlayerFromCode(code){
    var player = null;
    var i = 0;
    while(player === null && i < Scores.length){
        if(Scores[i].indexOf(code) !== -1)
            player = i;
        i++;
    }
    return player;
}

function ChallengeRegion(Challenger, Challenged){
    console.log("Challenging!!")
    var id = GetIdFromShortcode(Challenged);
    if(id != null)
        GetPregunta(id)

    $("#question-modal").css({"display":"block"});

    BlockedRegions.push(Challenger);
    gChallenger = Challenger;
    gChallenged = Challenged;
    SelectedRegion = null; // clear selection
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
    BlockedRegions = [];
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

function GetRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


/**
 AJAX
 **/
