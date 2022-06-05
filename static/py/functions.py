import requests

# VARS
mainUrl = 'https://pokeapi.co/api/v2/'
total_pokemon = 898
colors = {
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
# FUNCTIONS
def load_all():
    # Load all Poké data
    AllPokeData = requests.get(f'{mainUrl}pokemon?limit=100000').json()['results']
    MainPokeData = []
    for i, pokemon in enumerate(AllPokeData):
        curID = pokemon['url'][34:-1]
        AllPokeData[i]['id'] = curID
        AllPokeData[i]['img'] = f"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{curID}.png"
        AllPokeData[i]['name'] = AllPokeData[i]['name'].capitalize()
        if i < total_pokemon:
            MainPokeData.append(pokemon)
            MainPokeData[i]['id'] = curID
            MainPokeData[i]['img'] = f"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{curID}.png"
            MainPokeData[i]['name'] = MainPokeData[i]['name'].capitalize()
    # Load all Type Data
    AllPokeTypes = requests.get(f'{mainUrl}type').json()['results'][:-2]
    # Load all Gen Data
    AllPokeGens = requests.get(f'{mainUrl}generation').json()['results']
    return [AllPokeData, MainPokeData, AllPokeTypes, AllPokeGens]

def load_team(query_list):
    Team = []
    for i in range(6):
        if (i >= len(query_list)):
            Team.append(False)
        else:
            Team.append(query_list[i])
    TeamPokemon = []
    for i in range(len(Team)):
        query = Team[i]
        if (query == False): 
            TeamPokemon.append('False')
            continue
        data = requests.get(f'{mainUrl}pokemon/{query.lower()}').json()
        TeamPokemon.append({
            'name':data['name'].capitalize(),
            'id':str(data['id']),
            'types':data['types'],
            'img':f"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{data['id']}.png"
        })
    return TeamPokemon