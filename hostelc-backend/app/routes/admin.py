from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from app.extensions import mongo
from bson import ObjectId

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/users', methods=['GET'])
@jwt_required()
def get_all_users():
    users = list(mongo.db.users.find({}, {"password": 0}))
    for u in users:
        u['_id'] = str(u['_id'])
    return jsonify(users), 200

@admin_bp.route('/users/<user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    result = mongo.db.users.delete_one({"_id": ObjectId(user_id)})
    if result.deleted_count == 0:
        return jsonify({"msg": "User not found"}), 404
    return jsonify({"msg": "User deleted"}), 200

@admin_bp.route('/complaints', methods=['GET'])
@jwt_required()
def get_all_complaints():
    complaints = list(mongo.db.complaints.find())
    for c in complaints:
        c['_id'] = str(c['_id'])
    return jsonify(complaints), 200
