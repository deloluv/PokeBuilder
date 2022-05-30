from flask import Flask, render_template, jsonify
import static.py.load_data as PokeData

# Create an instance of our Flask app
app = Flask(__name__)

# ROUTES
@app.route('/')
def index():
    # Load Pokemon Data
    AllNames = PokeData.load_all()[1]
    AllIDs = PokeData.load_all()[2]
    return render_template('index.html', AllNames = AllNames, AllIDs = AllIDs)

# Run Flask App
if __name__ == '__main__':
   app.run()