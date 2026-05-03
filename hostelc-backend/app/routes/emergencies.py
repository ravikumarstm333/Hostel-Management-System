from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import mongo
from app.utils.decorators import role_required
from datetime import datetime
from bson import ObjectId

emergencies_bp = Blueprint('emergencies', __name__)

@emergencies_bp.route('', methods=['POST'])
@jwt_required()
@role_required('STUDENT')
def trigger_emergency():
    data = request.get_json()
    alert = {
        "student_id": get_jwt_identity(),
        "type": data.get('type', 'GENERAL'),
        "location": data.get('location', 'Hostel'),
        "status": "ACTIVE",
        "created_at": datetime.utcnow()
    }
    mongo.db.emergencies.insert_one(alert)
    return jsonify(msg="Emergency alert sent!"), 201

@emergencies_bp.route('', methods=['GET'])
@jwt_required()
@role_required('WARDEN')
def get_all_emergencies():
    alerts = list(mongo.db.emergencies.find().sort("created_at", -1))
    for a in alerts: a['_id'] = str(a['_id'])
    return jsonify(alerts), 200

@emergencies_bp.route('/my', methods=['GET'])
@jwt_required()
@role_required('STUDENT')
def get_my_emergencies():
    user_id = get_jwt_identity()
    alerts = list(mongo.db.emergencies.find({"student_id": user_id}).sort("created_at", -1))
    for a in alerts: a['_id'] = str(a['_id'])
    return jsonify(alerts), 200

@emergencies_bp.route('/<id>/status', methods=['PATCH'])
@jwt_required()
@role_required('WARDEN')
def resolve_emergency(id):
    mongo.db.emergencies.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"status": "RESOLVED", "resolved_at": datetime.utcnow()}}
    )
    return jsonify(msg="Emergency resolved"), 200