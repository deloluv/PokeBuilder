const DATASTORE = {};

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
    DATASTORE[elementID] = pokemon;
};