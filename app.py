from flask import Flask, render_template
import static.py.functions as PokeData

# Create an instance of our Flask app
app = Flask(__name__)

# VARS
MAINDATA = PokeData.load_all()
AllPokeData = MAINDATA[0]
MainPokeData = MAINDATA[1]

# ROUTES
@app.route('/')
def index():
    # Load All Data
    return render_template('index.html', AllPokeData = AllPokeData, MainPokeData = MainPokeData, LoadTeam = 'False')

@app.route('/team/<poke1>')
def load1(poke1):
    # Load Team
    TeamPokemon = PokeData.load_team(poke1, False, False, False, False, False)
    return render_template('index.html', TeamPokemon = TeamPokemon, AllPokeData = AllPokeData, MainPokeData = MainPokeData, LoadTeam = 'True')

@app.route('/team/<poke1>/<poke2>/')
def load2(poke1, poke2):
    # Load Team
    TeamPokemon = PokeData.load_team(poke1, poke2, False, False, False, False)
    return render_template('index.html', TeamPokemon = TeamPokemon, AllPokeData = AllPokeData, MainPokeData = MainPokeData, LoadTeam = 'True')

@app.route('/team/<poke1>/<poke2>/<poke3>/')
def load3(poke1, poke2, poke3):
    # Load Team
    TeamPokemon = PokeData.load_team(poke1, poke2, poke3, False, False, False)
    return render_template('index.html', TeamPokemon = TeamPokemon, AllPokeData = AllPokeData, MainPokeData = MainPokeData, LoadTeam = 'True')

@app.route('/team/<poke1>/<poke2>/<poke3>/<poke4>/')
def load4(poke1, poke2, poke3, poke4):
    # Load Team
    TeamPokemon = PokeData.load_team(poke1, poke2, poke3, poke4, False, False)
    return render_template('index.html', TeamPokemon = TeamPokemon, AllPokeData = AllPokeData, MainPokeData = MainPokeData, LoadTeam = 'True')

@app.route('/team/<poke1>/<poke2>/<poke3>/<poke4>/<poke5>/')
def load5(poke1, poke2, poke3, poke4, poke5):
    # Load Team
    TeamPokemon = PokeData.load_team(poke1, poke2, poke3, poke4, poke5, False)
    return render_template('index.html', TeamPokemon = TeamPokemon, AllPokeData = AllPokeData, MainPokeData = MainPokeData, LoadTeam = 'True')

@app.route('/team/<poke1>/<poke2>/<poke3>/<poke4>/<poke5>/<poke6>/')
def load6(poke1, poke2, poke3, poke4, poke5, poke6):
    # Load Team
    TeamPokemon = PokeData.load_team(poke1, poke2, poke3, poke4, poke5, poke6)
    return render_template('index.html', TeamPokemon = TeamPokemon, AllPokeData = AllPokeData, MainPokeData = MainPokeData, LoadTeam = 'True')
# Run Flask App
if __name__ == '__main__':
   app.run()