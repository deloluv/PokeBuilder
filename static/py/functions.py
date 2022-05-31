import requests

# VARS
mainUrl = 'https://pokeapi.co/api/v2/'
total_pokemon = 898

# FUNCTIONS
def load_all():
    # Load all data
    AllPokeData = requests.get(f'{mainUrl}pokemon?limit=100000').json()['results']
    MainPokeData = []
    for i, pokemon in enumerate(AllPokeData):
        curID = pokemon['url'][34:-1]
        AllPokeData[i]['id'] = curID
        AllPokeData[i]['img'] = f"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{curID}.png"
        if i < total_pokemon:
            MainPokeData.append(pokemon)
            MainPokeData[i]['id'] = curID
            MainPokeData[i]['img'] = f"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{curID}.png"
    return [AllPokeData, MainPokeData]