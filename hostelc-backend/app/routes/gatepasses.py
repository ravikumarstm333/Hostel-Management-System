from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import mongo
from app.utils.decorators import role_required
from datetime import datetime
from bson import ObjectId

gatepasses_bp = Blueprint('gatepasses', __name__)

# =========================
# STUDENT CREATE GATEPASS
# =========================
@gatepasses_bp.route('', methods=['POST'])
@jwt_required()
@role_required('student')
def request_gatepass():
    data = request.get_json()

    if not data or 'reason' not in data or 'outTime' not in data:
        return jsonify(msg="Missing required fields"), 400

    gatepass = {
        "student_id": get_jwt_identity(),
        "reason": data.get('reason'),
        "type": data.get('type', 'DAY_OUT'),
        "outTime": data.get('outTime'),
        "inTime": data.get('inTime', None),
        "status": "PENDING",
        "createdAt": datetime.utcnow()
    }

    mongo.db.gate_passes.insert_one(gatepass)
    return jsonify(msg="Gatepass submitted"), 201

# =========================
# STUDENT VIEW OWN
# =========================
@gatepasses_bp.route('/my', methods=['GET'])
@jwt_required()
@role_required('student')
def my_gatepasses():
    user_id = get_jwt_identity()

    data = list(mongo.db.gate_passes.find(
        {"student_id": user_id}
    ).sort("createdAt", -1))

    for d in data:
        d['_id'] = str(d['_id'])

    return jsonify(data), 200


# =========================
# WARDEN VIEW ALL
# =========================
@gatepasses_bp.route('', methods=['GET'])
@jwt_required()
@role_required('warden')
def all_gatepasses():
    data = list(mongo.db.gate_passes.find().sort("createdAt", -1))

    for d in data:
        d['_id'] = str(d['_id'])

    return jsonify(data), 200


# =========================
# WARDEN UPDATE STATUS
# =========================
@gatepasses_bp.route('/<id>/status', methods=['PATCH'])
@jwt_required()
@role_required('warden')
def update_status(id):
    data = request.get_json()

    mongo.db.gate_passes.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"status": data.get('status').upper()}}
    )

    return jsonify(msg="Updated"), 200