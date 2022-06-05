from flask import Flask, render_template, request
import static.py.functions as PokeData

# Create an instance of our Flask app
app = Flask(__name__)

# VARS
MAINDATA = PokeData.load_all()
# AllPokeData = MAINDATA[0]
# MainPokeData = MAINDATA[1]
# AllPokeTypes = MAINDATA[2]
# AllPokeGens = MAINDATA[3]

# ROUTES
@app.route('/')
def index():
    # Load All Data
    return render_template('index.html', PokeData = MAINDATA, LoadTeam = 'False')

@app.route('/team')
def test():
    pokemon = request.args.get('pokemon').split(',')
    TeamPokemon = PokeData.load_team(pokemon)
    return render_template('index.html', TeamPokemon = TeamPokemon, PokeData = MAINDATA, LoadTeam = 'True')

# Run Flask App
if __name__ == '__main__':
   app.run()