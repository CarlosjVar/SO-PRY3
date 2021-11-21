
from flask import Flask, request, Blueprint
from flask_cors import CORS, cross_origin
from controllers.xml_controller import listContent, write_dir, listContent
import json
directory_module = Blueprint('directory_module', __name__)


@directory_module.route("/api/dirs/create", methods=["POST"])
@cross_origin()
def create_dir():
    dir_info = request.get_json()
    username = dir_info["username"]
    args = {"name": dir_info["dir_name"]}
    target_dir = dir_info["target_dir"].split("/")
    target_dir.reverse()
    target_dir.pop()
    result = write_dir(username, "dir", target_dir, args)
    if len(result[1]) > 0:
        return {"errors": result[1]}
    return result[0]


@directory_module.route("/api/dirs/get", methods=["GET"])
@cross_origin()
def listItems():

    # Aquí se preparan los datos
    username = request.args.get("username")
    target_dir = request.args.get('target_dir')
    target_dir = target_dir.split("/")
    target_dir.reverse()
    target_dir.pop()
    # se llama la función
    result = listContent(target_dir, username)
    if len(result[1]) > 0:
        return {"errors": result[1]}

    return (result[0].toJson())
