from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from ..extensions import mongo
from app.utils.decorators import role_required
from bson import ObjectId
from datetime import datetime

warden_bp = Blueprint('warden', __name__)

# =========================
# GATEPASS MANAGEMENT
# =========================

@warden_bp.route('/gatepasses', methods=['GET'])
@jwt_required()
@role_required('WARDEN')
def get_gatepasses():
    data = list(mongo.db.gate_passes.find().sort("createdAt", -1))

    for d in data:
        d['_id'] = str(d['_id'])

    return jsonify(data), 200


@warden_bp.route('/gatepasses/<id>/status', methods=['PATCH'])
@jwt_required()
@role_required('WARDEN')
def update_gatepass_status(id):
    data = request.get_json()
    status = data.get('status')

    if status not in ["APPROVED", "REJECTED"]:
        return jsonify(msg="Invalid status"), 400

    result = mongo.db.gate_passes.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"status": status}}
    )

    if result.matched_count == 0:
        return jsonify(msg="Gatepass not found"), 404

    return jsonify(msg=f"Gatepass {status}"), 200


# =========================
# COMPLAINTS MANAGEMENT
# =========================

@warden_bp.route('/complaints', methods=['GET'])
@jwt_required()
@role_required('WARDEN')
def get_all_complaints():
    # Standardized to createdAt to match student submission
    data = list(mongo.db.complaints.find().sort("createdAt", -1))

    for c in data:
        c['_id'] = str(c['_id'])
        # Attach technician details if assigned
        if c.get("assigned_to"):
            try:
                tech = mongo.db.users.find_one({"_id": ObjectId(c["assigned_to"])})
                if tech:
                    c["assigned_to"] = {
                        "_id": str(tech["_id"]),
                        "name": tech.get("name")
                    }
            except:
                pass
    return jsonify(data), 200


@warden_bp.route('/complaints/<id>/assign', methods=['PATCH'])
@jwt_required()
@role_required('WARDEN')
def assign_technician(id):
    data = request.get_json()
    tech_id = data.get('technician_id')

    if not tech_id:
        return jsonify(msg="technician_id required"), 400

    mongo.db.complaints.update_one(
        {"_id": ObjectId(id)},
        {"$set": {
            "assigned_to": str(tech_id),
            "status": "ASSIGNED"
        }}
    )
    return jsonify(msg="Technician assigned successfully"), 200


# =========================
# ALLOTMENTS MANAGEMENT
# =========================

@warden_bp.route('/allotments', methods=['GET'])
@jwt_required()
@role_required('WARDEN')
def get_allotments():
    data = list(mongo.db.allotments.find().sort("createdAt", -1))

    for d in data:
        d['_id'] = str(d['_id'])

    return jsonify(data), 200


@warden_bp.route('/allotments/<id>/status', methods=['PATCH'])
@jwt_required()
@role_required('WARDEN')
def update_allotment_status(id):
    data = request.get_json()
    status = data.get('status')

    if status not in ["APPROVED", "REJECTED"]:
        return jsonify(msg="Invalid status"), 400

    result = mongo.db.allotments.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"status": status}}
    )

    if result.matched_count == 0:
        return jsonify(msg="Allotment not found"), 404

    return jsonify(msg=f"Allotment {status}"), 200