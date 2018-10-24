var AvailableRegions = ["BE","FR","BG","DK","HR","DE","BA","HU","JE","BY","GR","NL","PT","LI","LV","LT","LU","PL","XK","CH","EE","AL","IT","GG","CZ","GB","IE","ES","ME","MD","RO","RS","MK","SK","MT","SI","UA","AT"];
var AvailableRegionsID = ["Q31","Q142","Q219","Q35","Q224","Q183","Q225","Q28","Q785","Q184","Q41","Q55","Q45","Q347","Q211","Q37","Q32","Q4628","Q36","Q1246","Q39","Q191","Q222","Q38","Q25230","Q213","Q27","Q29","Q236","Q217","Q218","Q403","Q221","Q214","Q233","Q215","Q238","Q212","Q40"];
var AvailableRegionsLocation = [["50.75","4.5"],["46","2"],["43","25"],["56","10"],["45.16","15.5"],["51","9"],["43.91","17.67"],["47","20"],["49.21","-2.13"],["53","28"],["39","22"],["52.5","5.75"],["39.5","-8"],["47.16","9.53"],["57","25"],["56","24"],["49.75","6.16"],["62","-7"],["52","20"],["42.60","20.90"],["46.81","8.22"],["58.59","25.0"],["41.15","20.16"],["41.87","12.56"],["49.46","-2.58"],["49.81","15.47"],["55.37","-3.43"],["53.41","-8.24"],["42.7","19.37"],["47.41","28.36"],["45.94","24.99"],["44.01","21.00"],["41.60","21.74"],["48.66","19.69"],["35.93","14.37"],["46.15","14.99"],["43.94","12.45"],["48.37","31.16"],["47.51","14.55"]];

var UnavailableRegions = ["RU","SE","NO","AD","FI","IM","IS","AX"]; // To disable them from selection and color
var AutozoomRegions = ["VA","MC","SM","LI","MT","AD","LU","CY","XK","ME","GR","AL","MK"];
//var PlayerColors = ["#FF0C0C","#0C7AFF","#AAFF0C", "#e02aa9"]; // max number of players (4)
var PlayerColors = ["#CA1330","#3A3276","#93BC34", "#e02aa9"];
var PlayerColors_disabled = ["#FF0C0C","#0C7AFF","#AAFF0C", "#e02aa9"]; // to show countries as disabled when already used to attack
var PlayerNames = ["Rojos", "Azules", "Verdes", "Rosas"];
var BlockedRegions = []; // Temporal to store which countries this player already used to attack, resseted on every turn beggining
var NumPlayers = 4; // Number of players (max 4)

var SelectionColor = "#FFFFFF";
var DisabledRegionColor = "rgba(15,15,15,0.5)";

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

    CreateScoreBoards();

    console.log(["Player regions (Scores):", Scores])
    console.log(["Player resources (Resources):", Resources])
}

function CreateScoreBoards(){
    let TContainer = $("#team-container");
    TContainer.empty();
    for(i = 0; i < Scores.length; i++){
        TContainer.append("<div class='team-score-container' id='team_"+i+"'><div class='team-score' style='background:"+PlayerColors[i]+"'><div class='score'>"+Scores[i].length+"</div></div> <div data-color='"+PlayerColors[i]+"' class='teamtimer'></div> </div>");
    }
    InitScoreBoardsTimer();
}

function InitScoreBoardsTimer(){
    $('#team_'+Turn+' .teamtimer').circleProgress({
        value: 0,
        size: 114,
        thickness: 26,
        fill: PlayerColors[Turn],
        emptyFill: 'rgba(0,0,0,0.3)',
        reverse: true,
        animationStartValue: 1.0,
        animation:  { duration: 30000, easing: "linear" }
    });
    $("#team_"+ Turn +".team-score-container").addClass("big")
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
    // Example marker: {latLng: [40.416775, -3.703790], name: 'Spain', resources: 10}
    var marks = [];


    return marks;
}

function IsSameTeam(Turn, RegCode){
    return Scores[Turn].indexOf(String(RegCode)) !== -1;
}

function IsRegionEnabled(code){
    return UnavailableRegions.indexOf(String(code)) === -1;
}

function IsRegionBlocked(code){
    console.log(BlockedRegions.indexOf(String(code)))
    return BlockedRegions.indexOf(String(code)) !== -1;
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

    setTimeout(function(){ $("#question-modal").css({"display":"block"}); }, 450)


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

/**
 * @return {number}
 */
function PassTurn(){
    BlockedRegions = [];
    let lastTurn = Turn;
    let nextTurn = Turn+1;

    if(nextTurn >= Scores.length)
        nextTurn = 0;
    while(nextTurn !== lastTurn && Scores[nextTurn].length <= 0){
        nextTurn++;
    }
    Turn = nextTurn;
    console.log(Turn)
    PassTurnVisuals();

    return Turn;
}

function PassTurnVisuals(){
    let circles = $('.teamtimer');
    circles.circleProgress({ value:1, emptyFill: 'rgba(0,0,0,0)' });

    $(circles.circleProgress('widget')).stop();
    $('#team_'+Turn+' .teamtimer').circleProgress({
        value: 0,
        size: 114,
        thickness: 26,
        fill: PlayerColors[Turn],
        emptyFill: 'rgba(0,0,0,0.3)',
        reverse: true,
        animationStartValue: 1.0,
        animation:  { duration: 30000, easing: "linear" } });
    $(".team-score-container").removeClass("big")
    $("#team_"+ Turn +".team-score-container").addClass("big")
}

function GetNextTurn(){
    let lastTurn = Turn;
    let nextTurn = Turn+1;

    if(nextTurn >= Scores.length)
        nextTurn = 0;
    while(nextTurn !== lastTurn && Scores[nextTurn].length <= 0){
        nextTurn++;
    }

    return nextTurn;
}

/**
 * @return {boolean}
 */
function CanSelect(code){
    return Scores[Turn].indexOf(code) !== -1
}

function MovementsAvailable() {
    return Scores[Turn].length <= BlockedRegions.length;
}

/**
 * @return {boolean}
 */
function IsGameFinished(){
    return Scores[Turn].length >= AvailableRegions.length;
}

function GameWinner(){
    if(IsGameFinished())
    for(i = 0; i < Scores.length; i++){
        if(Scores[i].length > 0)
            return i;
    }

    return null;
}

function GameWinnerName(){
    let winner = GameWinner();
    if(winner != null)
        return PlayerNames[winner];


    return null;
}

/**
 * Map event handlers
 */
function SelectRegion(event, code, isSelected, region){
    /*console.log(event)
    console.log(code)
    console.log(isSelected)
    console.log(region)*/

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


// add callback to animated animations
$.fn.extend({
    animateCss: function (animationName, callback) {
        var animationEnd = (function (el) {
            var animations = {
                animation: 'animationend',
                OAnimation: 'oAnimationEnd',
                MozAnimation: 'mozAnimationEnd',
                WebkitAnimation: 'webkitAnimationEnd',
            };

            for (var t in animations) {
                if (el.style[t] !== undefined) {
                    return animations[t];
                }
            }
        })(document.createElement('div'));

        this.addClass('animated ' + animationName).one(animationEnd, function () {
            $(this).removeClass('animated ' + animationName);

            if (typeof callback === 'function') callback();
        });

        return this;
    },
});


/**
 VISUALS
 **/



function ShowPlayerFeedback(correct){
    if(correct){
        $(".correct").css("display", "block");
    }else{
        $(".incorrect").css("display", "block");
    }

    //$('#ttt').addClass('animated bounceOutLeft');
    $("#ttt").css("display", "block");
    $('#ttt').animateCss('animated jackInTheBox', function() {
        setTimeout(function(){ HidePlayerFeedback() }, 350);
    });
}

function HidePlayerFeedback(){
    $('#ttt').removeClass('jackInTheBox');
    $('#ttt').animateCss('fadeOutUp', function() {
        HidePlayerFeedbackEnd();
    });
}

function HidePlayerFeedbackEnd(){
    $('#ttt').removeClass('animated fadeOutUp');
    $("#ttt").css("display", "none");
    $(".correct").css("display", "none");
    $(".incorrect").css("display", "none");
}
