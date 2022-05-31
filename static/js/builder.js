const DATASTORE = {
    'pokemon':{},
    'types':{
        'normal':{'color':'#A8A77A'},
        'fire':{'color':'#EE8130'},
        'water':{'color':'#6390F0'},
        'electric':{'color':'#F7D02C'},
        'grass':{'color':'#7AC74C'},
        'ice':{'color':'#96D9D6'},
        'fighting':{'color':'#C22E28'},
        'poison':{'color':'#A33EA1'},
        'ground':{'color':'#E2BF65'},
        'flying':{'color':'#A98FF3'},
        'psychic':{'color':'#F95587'},
        'bug':{'color':'#A6B91A'},
        'rock':{'color':'#B6A136'},
        'ghost':{'color':'#735797'},
        'dragon':{'color':'#6F35FC'},
        'dark':{'color':'#705746'},
        'steel':{'color':'#B7B7CE'},
        'fairy':{'color':'#D685AD'}
    }
};

function checkDataStore(type, data) {
    if (type == 'pokemon') {
        const KEY = data['name'].toLowerCase();
        if (DATASTORE['pokemon'].hasOwnProperty(KEY)) {
            if (DATASTORE['pokemon'][KEY].hasOwnProperty('types')) {
                return DATASTORE['pokemon'][KEY]['types'];
            } else {
                d3.json(`https://pokeapi.co/api/v2/pokemon/${KEY}`)
                    .then(res => {
                        let types = res['types'];
                        DATASTORE['pokemon'][KEY]['types'] = types;
                        for (let i = 0; i < types.length; i++) {
                            checkDataStore('types', types[i]['type']['name']);
                        };
                        return DATASTORE['pokemon'][KEY]['types'];
                    });
            };
        } else {
            DATASTORE['pokemon'][data['name'].toLowerCase()] = data;
            return checkDataStore('pokemon', data);
        }
    } else if (type == 'types') {
        if (DATASTORE['types'][data].hasOwnProperty('damage_relations')) {
            return DATASTORE['types'][data]['damage_relations']
        } else {
            d3.json(`https://pokeapi.co/api/v2/type/${data}`)
                .then(res => {
                    DATASTORE['types'][data]['damage_relations'] = res['damage_relations'];
                    return
                });
        };
    }
};

function getPokemonInfo(pokemonURL) {

};

function addToTeam(pokemon) {
    const TEAM_BUILD = d3.select(`#poke_team`)
};

function onSelect(pokemon, elementID) {
    console.log(DATASTORE)
    const CUR_POKEMON = d3.select(`#${elementID}`)
    if (CUR_POKEMON.classed('selected')) {
        CUR_POKEMON.style('background-color', 'white')
            .classed('selected', false);
        return
    }
    CUR_POKEMON.style('background-color', 'yellowgreen')
        .classed('selected', true);
    checkDataStore('pokemon', pokemon);
};