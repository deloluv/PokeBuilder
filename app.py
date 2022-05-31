from flask import Flask, render_template, jsonify
import static.py.functions as PokeData

# Create an instance of our Flask app
app = Flask(__name__)

# ROUTES
@app.route('/')
def index():
    # Load Pokemon Data
    AllPokeData = PokeData.load_all()[0]
    MainPokeData = PokeData.load_all()[1]
    return render_template('index.html', AllPokeData = AllPokeData, MainPokeData = MainPokeData)

# Run Flask App
if __name__ == '__main__':
   app.run()