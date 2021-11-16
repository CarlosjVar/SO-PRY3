from flask import Flask, request
from flask_cors import CORS, cross_origin
import json
import xml.etree.ElementTree as ET

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route("/", methods=["GET"])
@cross_origin()
def mainRoute():
    return "Fabrzio es putito pero Carlos es mas"


@app.route("/login", methods=["POST"])
@cross_origin()
def login():
    login_info = request.get_json()
    print(login_info)
    return login_info


@app.route("/signup", methods=["POST"])
@cross_origin()
def signup():
    signup_info = request.get_json()
    tree = ET.parse('userInfo.xml')
    root = tree.getroot()
    users = root.find("usuarios")
    for usuario in users.findall("usuario"):
        if (usuario.get("username") == signup_info["username"]):
            return {"errors": ["Velvet está en peligro, ya existe un velvet usuario con ese velvet nombre de usuario"]}
    attrib = {"username": signup_info["username"],
              "password": signup_info["password"]}
    user = users.makeelement("usuario", attrib)
    users.append(user)
    # root.append(users)
    tree.write('userInfo.xml')
    return "Usuario creado correctamente"
