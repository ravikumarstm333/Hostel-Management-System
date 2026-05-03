from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.utils.decorators import role_required
from ..extensions import mongo
from bson import ObjectId

technician_bp = Blueprint('technician', __name__)

@technician_bp.route('/dashboard', methods=['GET'])
@jwt_required()
@role_required('TECHNICIAN')
def tech_dashboard():
    tech_id = get_jwt_identity()
    stats = {
        "assigned": mongo.db.complaints.count_documents({"assigned_to": tech_id, "status": "ASSIGNED"}),
        "resolved": mongo.db.complaints.count_documents({"assigned_to": tech_id, "status": "RESOLVED"})
    }
    return jsonify(stats), 200

@technician_bp.route('/tasks', methods=['GET'])
@jwt_required()
@role_required('TECHNICIAN')
def get_tasks():
    tech_id = get_jwt_identity()

    tasks = list(mongo.db.complaints.find({
        "assigned_to": str(tech_id)
    }))

    for t in tasks:
        t['_id'] = str(t['_id'])

    return jsonify(tasks), 200

@technician_bp.route('/tasks/<id>/resolve', methods=['PATCH'])
@jwt_required()
@role_required('TECHNICIAN')
def resolve_task(id):
    mongo.db.complaints.update_one({"_id": ObjectId(id)}, {"$set": {"status": "RESOLVED"}})
    return jsonify(msg="Task resolved"), 200
