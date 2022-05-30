from flask import Flask
import requests

# Create an instance of our Flask app
app = Flask(__name__)

# VARS
mainUrl = 'https://pokeapi.co/api/v2/'

# FUNCTION
def load_all():
    AllPokeData = requests.get(f'{mainUrl}pokemon?limit=898').json()['results']
    AllNames = []
    AllIDs = []
    for pokemon in AllPokeData:
        AllNames.append(pokemon['name'])
        AllIDs.append(pokemon['url'][34:-1])
    return [AllPokeData, AllNames, AllIDs]

# Run Flask App
if __name__ == '__main__':
   app.run()