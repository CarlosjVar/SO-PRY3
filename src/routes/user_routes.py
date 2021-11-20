
from flask import Flask, request, Blueprint
from flask_cors import CORS, cross_origin
from controllers.xml_controller import register_user
import json
user_module = Blueprint('user_module', __name__)


@user_module.route("/api/users/signup", methods=["POST"])
@cross_origin()
def signup():
    signup_info = request.get_json()
    result = register_user(signup_info)
    if len(result[1]) > 0:
        return {"errors": result[1]}
    return result[0].__dict__
