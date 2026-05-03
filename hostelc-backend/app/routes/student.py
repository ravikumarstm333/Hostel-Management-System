from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import mongo
from app.utils.decorators import role_required
from datetime import datetime

student_bp = Blueprint('student', __name__)

# =========================
# DASHBOARD
# =========================
@student_bp.route('/dashboard', methods=['GET'])
@jwt_required()
@role_required('STUDENT')
def get_dashboard():
    user_id = get_jwt_identity()

    complaints_count = mongo.db.complaints.count_documents({"student_id": user_id})
    gatepass_count = mongo.db.gate_passes.count_documents({
        "student_id": user_id,
        "status": "PENDING"
    })

    gatepasses = list(mongo.db.gate_passes.find(
        {"student_id": user_id}
    ).sort("createdAt", -1))

    for gp in gatepasses:
        gp['_id'] = str(gp['_id'])

    notices = list(mongo.db.notices.find().sort("createdAt", -1).limit(5))
    for notice in notices:
        notice['_id'] = str(notice['_id'])

    return jsonify({
        "stats": {
            "complaints_count": complaints_count,
            "pending_gatepass_count": gatepass_count,
            "gatepasses": gatepasses
        },
        "notices": notices,
        "message": "Welcome to Student Dashboard"
    }), 200


# =========================
# COMPLAINTS
# =========================
@student_bp.route('/complaints', methods=['POST'])
@jwt_required()
@role_required('STUDENT')
def post_complaint():
    data = request.get_json()

    if not data or 'title' not in data or 'description' not in data:
        return jsonify(msg="Missing required fields"), 400

    complaint = {
        "student_id": get_jwt_identity(),
        "title": data['title'],
        "category": data.get('category'),
        "description": data['description'],
        "status": "PENDING",
        "assigned_to": None,
        "createdAt": datetime.utcnow()
    }

    mongo.db.complaints.insert_one(complaint)
    return jsonify(msg="Complaint registered successfully"), 201


@student_bp.route('/complaints/my', methods=['GET'])
@jwt_required()
@role_required('STUDENT')
def get_my_complaints():
    user_id = get_jwt_identity()

    complaints = list(mongo.db.complaints.find(
        {"student_id": user_id}
    ).sort("createdAt", -1))

    for c in complaints:
        c['_id'] = str(c['_id'])

    return jsonify(complaints), 200



# =========================
# ALLOTMENT
# =========================
@student_bp.route('/allotments', methods=['POST'])
@jwt_required()
@role_required('STUDENT')
def post_allotment():
    data = request.get_json()

    if not data or 'requestedRoom' not in data:
        return jsonify(msg="Requested room is required"), 400

    allotment_request = {
        "student_id": get_jwt_identity(),
        "currentRoom": data.get('currentRoom'),
        "requestedRoom": data.get('requestedRoom'),
        "reason": data.get('reason'),
        "status": "PENDING",
        "createdAt": datetime.utcnow()
    }

    mongo.db.allotments.insert_one(allotment_request)
    return jsonify(msg="Allotment request submitted"), 201


@student_bp.route('/allotments/my', methods=['GET'])
@jwt_required()
@role_required('STUDENT')
def get_my_allotments():
    user_id = get_jwt_identity()

    requests = list(mongo.db.allotments.find(
        {"student_id": user_id}
    ).sort("createdAt", -1))

    for r in requests:
        r['_id'] = str(r['_id'])

    return jsonify(requests), 200


# =========================
# EMERGENCY
# =========================
@student_bp.route('/emergencies', methods=['POST'])
@jwt_required()
@role_required('STUDENT')
def post_emergency():
    data = request.get_json()

    emergency = {
        "student_id": get_jwt_identity(),
        "type": data.get('type'),
        "description": data.get('description'),
        "status": "PENDING",
        "createdAt": datetime.utcnow()
    }

    mongo.db.emergencies.insert_one(emergency)
    return jsonify(msg="Emergency request sent"), 201


@student_bp.route('/emergencies/my', methods=['GET'])
@jwt_required()
@role_required('STUDENT')
def get_my_emergencies():
    user_id = get_jwt_identity()

    history = list(mongo.db.emergencies.find(
        {"student_id": user_id}
    ).sort("createdAt", -1))

    for h in history:
        h['_id'] = str(h['_id'])

    return jsonify(history), 200