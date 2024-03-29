
from flask import Flask, request, Blueprint, Response
from flask_cors import CORS, cross_origin
from controllers.xml_controller import register_user, login_user
import json
user_module = Blueprint('user_module', __name__)


@user_module.route("/api/users/signup", methods=["POST"])
@cross_origin()
def signup():
    signup_info = request.get_json()
    result = register_user(signup_info)
    if len(result[1]) > 0:
        response_data = {"errors": result[1]}
        return Response(result[1], status=500, mimetype='application/json')
    return result[0].__dict__


@user_module.route("/api/users/login", methods=["POST"])
@cross_origin()
def login():
    login_info = request.get_json()
    result = login_user(login_info["username"], login_info["password"])
    if len(result[1]) > 0:
        response_data = {"errors": result[1]}
        return Response(result[1], status=500, mimetype='application/json')
    print(result[0])
    return result[0].__dict__
