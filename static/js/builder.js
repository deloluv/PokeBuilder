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

// COMPLETE
async function checkDataStore(type, data) {
    if (type == 'pokemon') {
        const KEY = data['name'].toLowerCase();
        if (DATASTORE['pokemon'].hasOwnProperty(KEY)) {
            // Search for Name
            if (DATASTORE['pokemon'][KEY].hasOwnProperty('types')) {
                // Return DataStore Entry
                return DATASTORE['pokemon'][KEY]['types'];
            } else {
                // Fetching Pokemon Entry
                await d3.json(`https://pokeapi.co/api/v2/pokemon/${KEY}`)
                    .then(res => {
                        let types = res['types'];
                        // Save to DataStore
                        DATASTORE['pokemon'][KEY]['types'] = types;
                        for (let i = 0; i < types.length; i++) {
                            // Update DataStore
                            checkDataStore('types', types[i]['type']['name']);
                        };
                        // Return Completed DataStore Entry
                        return DATASTORE['pokemon'][KEY]['types'];
                    });
            };
        } else {
            // Add Name to DataStore
            DATASTORE['pokemon'][data['name'].toLowerCase()] = data;
            // Update DataStore
            return checkDataStore('pokemon', data);
        }
    } else if (type == 'types') {
        if (DATASTORE['types'][data].hasOwnProperty('damage_relations')) {
            // Returns DataStore Entry
            return DATASTORE['types'][data]['damage_relations']
        } else {
            // Fetches Type Entry
            await d3.json(`https://pokeapi.co/api/v2/type/${data}`)
                .then(res => {
                    // Update DataStore
                    DATASTORE['types'][data]['damage_relations'] = res['damage_relations'];
                    // Returns DataStore Entry
                    return DATASTORE['types'][data]['damage_relations'];
                });
        };
    }
};

// COMPLETE
function checkAvailability() {
    const SPOT = d3.select('#poke_team').select('.team-unused');
    if (SPOT.empty()){
        alert('Out of Team Spots!');
        return false;
    } else { return true; };
};

// COMPLETE
async function calculateEffectiveness(type_list) {
    function extractNames(arr, type) {
        // Pull Names from Object
        let final = [];
        for (let i = 0; i < arr.length; i++) {
            if (type == 'type') {
                final.push(arr[i]['type']['name']);
            } else {
                final.push(arr[i]['name']);
            };
        };
        return final;
    };
    const TYPE_NAMES = extractNames(type_list, 'type');
    if (type_list.length > 1) {
        // 2 Typed Pokemon
        const ALL_STRONG = [];
        const ALL_WEAK = [];
        for (let i = 0; i < type_list.length; i++) {
            const TYPE = type_list[i]['type']['name'];
            await checkDataStore('types', TYPE);
            const DAMAGE = DATASTORE['types'][TYPE]['damage_relations'];
            const DOUBLE_TO = extractNames(DAMAGE['double_damage_to']);
            const HALF_TO = extractNames(DAMAGE['half_damage_to']);
            for (let n = 0; n < DOUBLE_TO.length; n++) {
                if (TYPE_NAMES.find(e => e == DOUBLE_TO[n])) { 
                    if (DOUBLE_TO[n] != 'dragon' && DOUBLE_TO[n] != 'ghost') { continue };
                };
                ALL_STRONG.push(DOUBLE_TO[n]);
            };
            for (let n = 0; n < HALF_TO.length; n++) {
                if (TYPE_NAMES.find(e => e == HALF_TO[n])) { continue };
                ALL_WEAK.push(HALF_TO[n]);
            };
        };
        const STRONG = [...new Set(ALL_STRONG)];
        const WEAK = [...new Set(ALL_WEAK)];
        return [STRONG, WEAK];
    } else {
        // 1 Type Pokemon
        const TYPE = type_list[0]['type']['name'];
        await checkDataStore('types', TYPE);
        const DAMAGE = DATASTORE['types'][TYPE]['damage_relations'];
        const DOUBLE_TO = extractNames(DAMAGE['double_damage_to']);
        const HALF_TO = extractNames(DAMAGE['half_damage_to']);
        const STRONG = DOUBLE_TO;
        const WEAK = HALF_TO;
        return [STRONG, WEAK];
    };
};

// COMPLETE
async function addToTeam(name) {
    // Selections
    const TEAM_BUILD = d3.select('#poke_team');
    const TEAM_SPOT = TEAM_BUILD.select('.team-unused')
        .classed('team-unused', false)
        .classed('team-used', true)
        .attr('id', name);
    const TEAM_SPRITE = TEAM_SPOT.select('#team-sprite');
    const TEAM_BREAK = TEAM_SPOT.select('#team-break');
    const TEAM_TYPE = TEAM_SPOT.select('#team-type');
    const TEAM_NAME = TEAM_SPOT.select('#team-name');
    const TEAM_EFFECTIVENESS = TEAM_SPOT.select('#team-effectiveness')
        .append('div')
        .classed('row', true);
    // Data
    const POKEMON = DATASTORE['pokemon'][name.toLowerCase()];
    const POKE_SPRITE = POKEMON['img'];
    const POKE_TYPE = POKEMON['types'];
    const POKE_NAME = POKEMON['name'];
    const EFFECTIVENESS = await calculateEffectiveness(POKE_TYPE);
    // Name
    TEAM_NAME.append('span')
        .classed('text-center', true)
        .classed('fw-bold', true)
        .text(POKE_NAME);
    // Sprite
    TEAM_SPRITE.attr('src', POKE_SPRITE);
    // Break
    TEAM_BREAK.append('hr');
    // Type
    const TEAM_TYPE_SPOT = TEAM_TYPE.append('div')
        .classed('row', true)
        .classed('p-2', true)
        .classed('gap-2', true);
    for (let i = 0; i < POKE_TYPE.length; i++) {
        let curType = POKE_TYPE[i]['type']['name'];
        let typeHex = DATASTORE['types'][curType]['color'];
        TEAM_TYPE_SPOT.append('div')
            .classed('col', true)
            .classed('rounded', true)
            .classed('text-center', true)
            .classed('border', true)
            .classed('box-shadow-effect', true)
            .style('background-color', typeHex)
            .append('span')
            .classed('text-light', true)
            .classed('text-uppercase', true)
            .classed('fw-bold', true)
            .text(curType);
    };
    // Strong Against
    const STRONG = EFFECTIVENESS[0];
    const STRONG_EFFECTIVENESS_CARD = TEAM_EFFECTIVENESS.append('div')
        .classed('col', true)
        .classed('text-center', true);
    STRONG_EFFECTIVENESS_CARD.append('span')
        .classed('text-dark', true)
        .classed('fw-semibold', true)
        .classed('fs-6', true)
        .text('Very Effective');
    if (STRONG.length < 1) {
        STRONG_EFFECTIVENESS_CARD.append('div')
            .classed('col', true)
            .classed('rounded', true)
            .classed('text-center', true)
            .classed('border', true)
            .classed('border-2', true)
            .classed('super-effective', true)
            .classed('box-shadow-effect', true)
            .style('background-color', 'black')
            .append('span')
            .classed('text-light', true)
            .classed('text-uppercase', true)
            .classed('fw-bold', true)
            .text('N/A');
    };
    for (let i = 0; i < STRONG.length; i++) {
        let typeHex = DATASTORE['types'][STRONG[i]]['color'];
        STRONG_EFFECTIVENESS_CARD.append('div')
            .classed('col', true)
            .classed('rounded', true)
            .classed('text-center', true)
            .classed('border', true)
            .classed('border-2', true)
            .classed('super-effective', true)
            .classed('box-shadow-effect', true)
            .style('background-color', typeHex)
            .append('span')
            .classed('text-light', true)
            .classed('text-uppercase', true)
            .classed('fw-bold', true)
            .classed('fs-6', true)
            .text(STRONG[i]);
    };
    // Weak Against
    const WEAK = EFFECTIVENESS[1];
    const WEAK_EFFECTIVENESS_CARD = TEAM_EFFECTIVENESS.append('div')
        .classed('col', true)
        .classed('text-center', true);
    WEAK_EFFECTIVENESS_CARD.append('span')
        .classed('text-dark', true)
        .classed('fw-semibold', true)
        .classed('fs-6', true)
        .text('Not Effective');
    if (WEAK.length < 1) {
        WEAK_EFFECTIVENESS_CARD.append('div')
            .classed('col', true)
            .classed('rounded', true)
            .classed('text-center', true)
            .classed('border', true)
            .classed('border-2', true)
            .classed('not-effective', true)
            .classed('box-shadow-effect', true)
            .style('background-color', 'black')
            .append('span')
            .classed('text-light', true)
            .classed('text-uppercase', true)
            .classed('fw-bold', true)
            .text('N/A');
    };
    for (let i = 0; i < WEAK.length; i++) {
        let typeHex = DATASTORE['types'][WEAK[i]]['color'];
        WEAK_EFFECTIVENESS_CARD.append('div')
            .classed('col', true)
            .classed('rounded', true)
            .classed('text-center', true)
            .classed('border', true)
            .classed('border-2', true)
            .classed('not-effective', true)
            .classed('box-shadow-effect', true)
            .style('background-color', typeHex)
            .append('span')
            .classed('text-light', true)
            .classed('text-uppercase', true)
            .classed('fw-bold', true)
            .text(WEAK[i]);
    };
};

// COMPLETE
function removeFromTeam(pokemon) {
    const TEAM_BUILD = d3.select('#poke_team');
    // Used Class Tag
    const SPOT = TEAM_BUILD.select(`#${pokemon}`)
        .classed('team-unused', true)
        .classed('team-used', false)
        .attr('id', '')
        .html("");
    // Reset Name
    SPOT.append('div')
        .attr('id', 'team-name')
        .classed('text-center', true); 
    // Reset Type
    SPOT.append('div')
        .classed('container', true)
        .attr('id', 'team-type'); 
    // Reset Img
    SPOT.append('img')
        .attr('id', 'team-sprite')
        .classed('mx-auto', true)
        .classed('d-block', true)
        .attr('src', '/static/imgs/pokeball.png');
    // Break
    SPOT.append('div')
        .attr('id', 'team-break');
    // Reset Effectiveness
    SPOT.append('div')
        .classed('container', true)
        .attr('id', 'team-effectiveness')
};

// COMPLETE
function removeAll() { 
    const TEAM_BUILD = d3.select('#poke_team').html("");
    for (let i = 0; i < 6; i++) {
        // Reset Card
        const SPOT = TEAM_BUILD.append('div')
            .classed('team-unused', true)
            .classed('col-6', true)
            .classed('col-sm-4', true)
            .classed('col-md-4', true)
            .classed('col-lg-2', true)
            .classed('box-shadow-effect', true)
            .classed('p-3', true);
        // Reset Name
        SPOT.append('div')
            .attr('id', 'team-name')
            .classed('text-center', true);
        // Reset Type
        SPOT.append('div')
            .classed('container', true)
            .attr('id', 'team-type'); 
        // Reset Img
        SPOT.append('img')
            .attr('id', 'team-sprite')
            .classed('mx-auto', true)
            .classed('d-block', true)
            .attr('src', '/static/imgs/pokeball.png');
        // Break
        SPOT.append('div')
            .attr('id', 'team-break');
        // Reset Effectiveness
        SPOT.append('div')
            .classed('container', true)
            .attr('id', 'team-effectiveness')
        // Reset Pokedex Selections 
        d3.selectAll('.selected')
            .style('background-color', 'white')
            .style('border-color', 'white')
            .classed('selected', false);
    };
};

// COMPLETE
async function onSelect(pokemon, elementID) {
    console.log(DATASTORE)
    const CUR_POKEMON = d3.select(`#${elementID}`);
    if (CUR_POKEMON.classed('selected')) {
        // Deselecting
        CUR_POKEMON.style('background-color', 'white')
            .style('border-color', 'white')
            .classed('selected', false);
        removeFromTeam(pokemon['name'])
        return
    }
    // Check Space on Team
    if (!checkAvailability()) { return };
    // Select
    CUR_POKEMON.style('background-color', 'yellowgreen')
        .style('border-color', '#8bb92d')
        .classed('selected', true);
    // Upload to DataStore
    await checkDataStore('pokemon', pokemon);
    // Update Team
    await addToTeam(pokemon['name']);
};

// IN PROGRESS
function filterSearch(query) {
    const POKEDEX = d3.select('#pokedex').selectAll('a');
    const POKEDEX_VALUES = POKEDEX['_groups'][0];
    for (let i = 0; i < POKEDEX_VALUES.length; i++) {
        let curID = POKEDEX_VALUES[i]['id'].slice(4);
        let curName = POKEDEX_VALUES[i]['children']['poke-name']['innerHTML'];
        if (!isNaN(query)) {
            if (!curID.startsWith(query)) {
                d3.select(`#poke${curID}`).style('display', 'none');
            } else {
                d3.select(`#poke${curID}`).style('display', 'block');
            };
        } else {
            if (!curName.startsWith(query)) {
                d3.select(`#poke${curID}`).style('display', 'none');
            } else {
                d3.select(`#poke${curID}`).style('display', 'block');
            };
        };
        
    };
};