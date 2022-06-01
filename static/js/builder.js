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

async function checkDataStore(type, data) {
    if (type == 'pokemon') {
        const KEY = data['name'].toLowerCase();
        if (DATASTORE['pokemon'].hasOwnProperty(KEY)) {
            if (DATASTORE['pokemon'][KEY].hasOwnProperty('types')) {
                return DATASTORE['pokemon'][KEY]['types'];
            } else {
                await d3.json(`https://pokeapi.co/api/v2/pokemon/${KEY}`)
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
            await d3.json(`https://pokeapi.co/api/v2/type/${data}`)
                .then(res => {
                    DATASTORE['types'][data]['damage_relations'] = res['damage_relations'];
                    return DATASTORE['types'][data]['damage_relations'];
                });
        };
    }
};

function checkAvailability() {
    const SPOT = d3.select('#poke_team').select('.team-unused');
    if (SPOT.empty()){
        alert('Out of Team Spots!');
        return false;
    } else { return true; };
};

function calculateEffectiveness(type_list) {

    return [];
};

function addToTeam(name) {
    const TEAM_BUILD = d3.select('#poke_team');
    const TEAM_SPOT = TEAM_BUILD.select('.team-unused')
        .classed('team-unused', false)
        .classed('team-used', true)
        .attr('id', name);
    const TEAM_SPRITE = TEAM_SPOT.select('#team-sprite');
    const TEAM_TYPE = TEAM_SPOT.select('#team-type');
    const TEAM_NAME = TEAM_SPOT.select('#team-name');
    const TEAM_SUPEREFF = TEAM_SPOT.select('#supereff-team');
    const TEAM_NOTEFF = TEAM_SPOT.select('#noteff-team');

    const POKEMON = DATASTORE['pokemon'][name.toLowerCase()];
    const POKE_SPRITE = POKEMON['img'];
    const POKE_TYPE = POKEMON['types'];
    const POKE_NAME = POKEMON['name'];

    TEAM_SPRITE.attr('src', POKE_SPRITE);
    for (let i = 0; i < POKE_TYPE.length; i++) {
        let curType = POKE_TYPE[i]['type']['name'];
        let typeProper = curType.charAt(0).toUpperCase() + curType.slice(1);
        let typeHex = DATASTORE['types'][curType]['color'];
        TEAM_TYPE.append('div')
            .classed('container', true)
            .classed('rounded', true)
            .style('background-color', typeHex)
            .append('p')
            .classed('text-center', true)
            .text(typeProper);
    };
    TEAM_NAME.append('p')
        .classed('text-center', true)
        .text(POKE_NAME);
};

function removeFromTeam(pokemon) {
    const TEAM_BUILD = d3.select('#poke_team');
    const SPOT = TEAM_BUILD.select(`#${pokemon}`)
        .classed('team-unused', true)
        .classed('team-used', false)
        .html("");
    SPOT.append('img')
        .attr('id', 'team-sprite')
        .classed('mx-auto', true)
        .classed('d-block', true)
        .attr('src', '/static/imgs/pokeball.png');
    SPOT.append('div')
        .attr('id', 'team-type');
    SPOT.append('div')
        .attr('id', 'team-name');    
};

function removeAll() {
    const TEAM_BUILD = d3.select('#poke_team').html("");
    for (let i = 0; i < 6; i++) {
        const SPOT = TEAM_BUILD.append('div')
            .classed('team-unused', true)
            .classed('col-6', true)
            .classed('col-sm-4', true)
            .classed('col-md-4', true)
            .classed('col-lg-2', true)
            .classed('box-shadow-effect', true)
            .classed('p-3', true);
        SPOT.append('img')
            .attr('id', 'team-sprite')
            .classed('mx-auto', true)
            .classed('d-block', true)
            .attr('src', '/static/imgs/pokeball.png');
        SPOT.append('div')
            .attr('id', 'team-type');
        SPOT.append('div')
            .attr('id', 'team-name');  
        d3.selectAll('.selected')
            .style('background-color', 'white')
            .classed('selected', false);
    };
}

async function onSelect(pokemon, elementID) {
    console.log(DATASTORE);
    const CUR_POKEMON = d3.select(`#${elementID}`);
    if (CUR_POKEMON.classed('selected')) {
        CUR_POKEMON.style('background-color', 'white')
            .classed('selected', false);
        removeFromTeam(pokemon['name'])
        return
    }
    if (!checkAvailability()) { return };
    CUR_POKEMON.style('background-color', 'yellowgreen')
        .classed('selected', true);
    await checkDataStore('pokemon', pokemon);
    await addToTeam(pokemon['name']);
};