from flask import Flask, request
from flask_cors import CORS, cross_origin
import json
import xml.etree.ElementTree as ET
from routes.user_routes import user_module
from routes.directory_routes import directory_module


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.register_blueprint(user_module)
app.register_blueprint(directory_module)
