from flask import Flask, request
from flask_cors import CORS, cross_origin
import json
import xml.etree.ElementTree as ET
from routes.user_routes import user_module
from controllers.fs_controller import create_drive
from controllers.xml_controller import write_dir
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.register_blueprint(user_module)

print("asd")

write_dir("Prueba2", "dir", "asdasd", {"name": "Carpeta nueva"})


@app.route("/login", methods=["POST"])
@cross_origin()
def login():
    login_info = request.get_json()
    print(login_info)
    return login_info