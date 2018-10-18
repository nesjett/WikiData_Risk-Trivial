//Variables globales
var correcta;
var preguntas;

function GetPregunta(pais){
	console.log("ENTROOOOOO")
	preguntas = new Array();
	//var x = Math.floor((Math.random() * 9) + 0);
	var x=0;
	var pregunta;
	//Se podrian anyadir mas en teoria jajaja xddddddddddd
	switch(x){
		case 0:
			GetGobernador(pais);
			break;
	}
}

function SetQuestionsForm(){
    $("#modal-text").html("¿Quién es el presidente del gobierno de este país?");
    for(i = 0; i < preguntas.length; i++){
		var isCorrect = true;
		$("#opt-container").append("<button data-correct='"+isCorrect+"' class='option'>"+preguntas[i]+"</button>")
		isCorrect = false;
    }
}


function GetGobernador(pais) {

    //Pido el gobernador del país que me pasan
    var endpointUrl = 'https://query.wikidata.org/sparql',
        sparqlQuery = "SELECT ?gobernadorLabel WHERE {\n" +
            "		?pais wdt:P31 wd:Q6256.\n" +
            "		?pais wdt:P17 wd:"+pais+".\n" +
            "		?pais wdt:P6 ?gobernador .\n" +
            "		SERVICE wikibase:label { bd:serviceParam wikibase:language \"[AUTO_LANGUAGE],en\". }\n" +
            "		}",
        settings = {
            headers: { Accept: 'application/sparql-results+json' },
            data: { query: sparqlQuery }
        };

    $.ajax( endpointUrl, settings ).then( function ( data ) {
        //$( 'body' ).append( ( $('<pre>').text( JSON.stringify( data) ) ) );
        console.log(data.results.bindings[0].gobernadorLabel.value);
        var gobernador = data.results.bindings[0].gobernadorLabel.value;
        preguntas.push(gobernador)

        GetGobernadores(gobernador.toString())
    } );

}

function GetGobernadores(gobernador){
	var endpointUrl = 'https://query.wikidata.org/sparql',
    sparqlQuery = "SELECT ?gobernadorLabel WHERE {\n" +
        "		?pais wdt:P31 wd:Q6256.\n" +
        "		?pais wdt:P30 wd:Q46.\n" +
        "		?pais wdt:P6 ?gobernador .\n" +
        "		SERVICE wikibase:label { bd:serviceParam wikibase:language \"[AUTO_LANGUAGE],en\". }\n" +
        "		}",
    settings = {
        headers: { Accept: 'application/sparql-results+json' },
        data: { query: sparqlQuery }
    };
    var gobernadores=[];
    
	$.ajax( endpointUrl, settings ).then( function ( data ) {
	    //$( 'body' ).append( ( $('<pre>').text( JSON.stringify( data) ) ) );
	    for(i=0;i<data.results.bindings.length;i++){
	    	//console.log(data.results.bindings[i].gobernadorLabel.value);
	    	gobernadores.push(data.results.bindings[i].gobernadorLabel.value );
	    }
	    
       	var falsas=[];
		while(preguntas.length<4){
			var y = Math.floor((Math.random() * gobernadores.length) + 0);
			//console.log(y);
			if(gobernador.localeCompare(gobernadores[y])!=0){
                preguntas.push(gobernadores[y]);
			}
		}
        //preguntas.concat(falsas);
        SetQuestionsForm();
	} );

	
}

function Correjir(){
	for(i=1;i<5;i++){
		var e = "r"+i.toString();
		if(document.getElementById(e).checked&&correcta.localeCompare(e)==0)
		{
			console.log("bien");
			return 1;
		}
	}
	console.log("mal");
	return 0;
	
}




//Otras Consultas ...............................................
function GetMonumentos(pais){
	const endpointUrl = 'https://query.wikidata.org/sparql',
      sparqlQuery = `SELECT ?gobernadorLabel WHERE {
		?pais wdt:P31 wd:Q6256.
		?pais wdt:P17 wd:${pais}.
		?pais wdt:P6 ?gobernador .
		SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
		}`,
      fullUrl = endpointUrl + '?query=' + encodeURIComponent( sparqlQuery ),
      headers = { 'Accept': 'application/sparql-results+json' };

 	var monumentos=[];
	fetch( fullUrl, { headers } ).then( body => body.json() ).then( json => {
	    const { head: { vars }, results } = json;
	    for ( const result of results.bindings ) {
	        for ( const variable of vars ) {
	            monumentos.push(result[variable].value );
	        }
	    }
	} );

	return monumentos;
}

function GetCiudadesPobladas(pais){
		const endpointUrl = 'https://query.wikidata.org/sparql',
      sparqlQuery = `SELECT ?ciudadLabel ?poblacionLabel WHERE{
		?ciudad wdt:P31 wd:Q515.
		?ciudad wdt:P17 wd:${pais}.
		?ciudad wdt:P1082 ?poblacion .
		SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
		}
		ORDER BY DESC (?poblacion)
		LIMIT 30`,
      fullUrl = endpointUrl + '?query=' + encodeURIComponent( sparqlQuery ),
      headers = { 'Accept': 'application/sparql-results+json' };

 	var ciudadesPobladas=[];
	fetch( fullUrl, { headers } ).then( body => body.json() ).then( json => {
	    const { head: { vars }, results } = json;
	    for ( const result of results.bindings ) {
	        for ( const variable of vars ) {
	            console.log( '%s: %o', variable, result[variable] );
	            ciudadesPobladas.push(result[variable].value);
	        }
	    }
	} );
	console.log(ciudadesPobladas);
	//Las primeras ciudades son las más pobladas.
	//return ciudadesPobladas;
}


function GetVecindades(){
	const endpointUrl = 'https://query.wikidata.org/sparql',
      sparqlQuery = `SELECT ?paisLabel ?vecinos WHERE {
	  ?pais wdt:P31 wd:Q6256.
      ?pais wdt:P30 wd:Q46.
	  ?pais wdt:P47 ?vecinos.
	  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
	}
ORDER BY (?paisLabel)`,
      fullUrl = endpointUrl + '?query=' + encodeURIComponent( sparqlQuery ),
      headers = { 'Accept': 'application/sparql-results+json' };

fetch( fullUrl, { headers } ).then( body => body.json() ).then( json => {
    const { head: { vars }, results } = json;
    for ( const result of results.bindings ) {
        for ( const variable of vars ) {
            console.log( '%s: %o', variable, result[variable] );
            /*if(variable.localeCompare("paisLabel")==0&&){
            	var pais={nombre:result[variable].value,vecinos=[]};
            }*/
        }
        console.log( '---' );
    }
} );

	/*paises = []

	for()
	paises.push() 

	return vecinos;*/

}



function GetCiudadesSuperficies(pais){
	const endpointUrl = 'https://query.wikidata.org/sparql',
	      sparqlQuery = `
	#fronteras de hungria Q28 
	SELECT ?ciudadLabel ?superfLabel WHERE {
	  ?ciudad wdt:P31 wd:Q515.
	  ?pais wdt:P17 wd:${pais}.
	  ?ciudad wdt:P2046 ?superf
	  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
	}
	ORDER BY DESC (?superf)
    LIMIT 100`,
	      fullUrl = endpointUrl + '?query=' + encodeURIComponent( sparqlQuery ),
	      headers = { 'Accept': 'application/sparql-results+json' };

	var ciudadesSuperficie = [];
	fetch( fullUrl, { headers } ).then( body => body.json() ).then( json => {
	    const { head: { vars }, results } = json;
	    for ( const result of results.bindings ) {
	        for ( const variable of vars ) {
	            ciudadesSuperficie.push(result[variable].value);
	        }
	        
	    }
	} );
//Los 4 primeros elementos del array son las ciudades más pobladas, siendo el primer el elemento la que más.
	return ciudadesSuperficie;

}















