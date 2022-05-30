from flask import Flask, render_template, jsonify

# Create an instance of our Flask app
app = Flask(__name__)

# ROUTES
@app.route('/')
def index():
    # Load Pokemon Data
    import static.py.load_data as PokeData
    return render_template('index.html')
