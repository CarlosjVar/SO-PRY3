
from flask import Flask, request, Blueprint, Response
from flask_cors import CORS, cross_origin
from controllers.xml_controller import listContent, xml_write, listContent
import json
directory_module = Blueprint('directory_module', __name__)


@directory_module.route("/api/dirs/create", methods=["POST"])
@cross_origin()
def create_dir():
    args = request.get_json()
    username = args["username"]
    type = args["type"]
    target_dir = args["target_dir"]
    if target_dir == '':
        target_dir = []
    else:
        target_dir = target_dir.split("/")
        target_dir.reverse()
    result = xml_write(username, type, target_dir, args)
    if len(result[1]) > 0:
        response_data = {"errors": result[1]}
        return Response(str(response_data), status=500, mimetype='application/json')
    return (result[0].toJson())


@directory_module.route("/api/dirs/get", methods=["GET"])
@cross_origin()
def listItems():

    # Aquí se preparan los datos
    username = request.args.get("username")
    target_dir = request.args.get('target_dir')
    if target_dir == '':
        target_dir = []
    else:
        target_dir = target_dir.split("/")
        target_dir.reverse()
  # se llama la función
    result = listContent(target_dir, username)
    if len(result[1]) > 0:
        response_data = {"errors": result[1]}
        return Response(str(response_data), status=500, mimetype='application/json')

    return (result[0].toJson())
