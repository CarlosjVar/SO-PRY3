
from flask import Flask, request, Blueprint, Response
from flask_cors import CORS, cross_origin
from controllers.xml_controller import listContent, xml_write, listContent, copy_dir, delete_dir, modifyFileHelper, move_item, share_item
import json
directory_module = Blueprint('directory_module', __name__)


@directory_module.route("/api/dirs/create", methods=["POST"])
@cross_origin()
def create_dir():

    args = request.get_json()
    username = args["username"]
    target_dir = args["target_dir"]
    if target_dir == '':
        target_dir = []
    else:
        target_dir = target_dir.split("/")
        target_dir.reverse()
    result = xml_write(username, "dir", target_dir, args)
    if len(result[1]) > 0:
        response_data = {"errors": result[1]}
        return Response(result[1], status=500, mimetype='application/json')
    return (result[0].toJson())


@directory_module.route("/api/file/create", methods=["POST"])
@cross_origin()
def create_file():
    args = request.get_json()
    username = args["username"]
    target_dir = args["target_dir"]
    if target_dir == '':
        target_dir = []
    else:
        target_dir = target_dir.split("/")
        target_dir.reverse()
    result = xml_write(username, "file", target_dir, args)
    if len(result[1]) > 0:
        response_data = {"errors": result[1]}
        return Response(result[1], status=500, mimetype='application/json')
    return (result[0].toJson())


@directory_module.route("/api/dirs/get", methods=["GET"])
@cross_origin()
def list_items():
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
        return Response(result[1], status=500, mimetype='application/json')

    return (result[0].toJson())


@directory_module.route("/api/dirs/copy", methods=["POST"])
@cross_origin()
def copy_item():
    args = request.get_json()
    source_dir = args["from_directory"]
    if source_dir == '':
        source_dir = []
    else:
        source_dir = source_dir.split("/")
        source_dir.reverse()
    target_dir = args["to_directory"]
    if target_dir == '':
        target_dir = []
    else:
        target_dir = target_dir.split("/")
        target_dir.reverse()
    type = args["type"]
    element = args["target_element"]
    username = args["username"]

    result = copy_dir(source_dir, target_dir, element, username, type)
    if len(result[1]) > 0:
        response_data = {"errors": result[1]}
        return Response(result[1], status=500, mimetype='application/json')

    return (result[0])


@directory_module.route("/api/dirs/delete", methods=["POST"])
@cross_origin()
def delete_item():
    args = request.get_json()

    item_list = args["items"]

    source_dir = item_list[0]["from_directory"]
    if source_dir == '':
        source_dir = []
    else:
        source_dir = source_dir.split("/")
        source_dir.reverse()

    username = item_list[0]["username"]
    errors = []
    for item in item_list:
        source_dir = item["from_directory"]
        if source_dir == '':
            source_dir = []
        else:
            source_dir = source_dir.split("/")
            source_dir.reverse()
        element = item["target_element"]
        type = item["type"]
        result = delete_dir(source_dir, element, type, username)
        errors += result[1]
    if len(errors) > 0:
        response_data = {"errors": result[1][0]}
        return Response(result[1], status=500, mimetype='application/json')
    return "Su item cayó ante las ya no tan grandes pero aún majestusas garras de Velvet" if result[
        0] else "Velvet no pudo obliterar su item porque no lo encontró"


@directory_module.route("/api/file/modify", methods=["POST"])
@cross_origin()
def modify_file():
    args = request.get_json()
    username = args["username"]
    target_dir = args["target_dir"]
    if target_dir == '':
        target_dir = []
    else:
        target_dir = target_dir.split("/")
        target_dir.reverse()
    del args["username"]
    del args["target_dir"]
    result = modifyFileHelper(target_dir, args, args["old_name"], username)
    if len(result[1]) > 0:
        response_data = {"errors": result[1]}
        return Response(result[1], status=500, mimetype='application/json')
    return result[0].__dict__


@directory_module.route("/api/dir/move", methods=["POST"])
@cross_origin()
def move_item_r():
    args = request.get_json()
    source_dir = args["from_directory"]
    if source_dir == '':
        source_dir = []
    else:
        source_dir = source_dir.split("/")
        source_dir.reverse()
    target_dir = args["to_directory"]
    if target_dir == '':
        target_dir = []
    else:
        target_dir = target_dir.split("/")
        target_dir.reverse()
    type = args["type"]
    element = args["target_element"]
    username = args["username"]
    result = move_item(source_dir, target_dir, element, username, type)
    if len(result[1]) > 0:
        response_data = {"errors": result[1]}
        return Response(result[1], status=500, mimetype='application/json')
    return {"message": result[0]}


@directory_module.route("/api/dir/share", methods=["POST"])
@cross_origin()
def share_item_r():
    args = request.get_json()
    source_dir = args["from_directory"]
    if source_dir == '':
        source_dir = []
    else:
        source_dir = source_dir.split("/")
        source_dir.reverse()
    username = args["username"]
    target_username = args["target_username"]
    element = args["target_element"]
    type = args["type"]
    result = share_item(source_dir, element, username, target_username, type)
    if len(result[1]) > 0:
        response_data = {"errors": result[1]}
        return Response(result[1], status=500, mimetype='application/json')
    return result[0]
