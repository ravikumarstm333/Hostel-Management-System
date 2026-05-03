from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import mongo
from app.utils.decorators import role_required
from datetime import datetime
from bson import ObjectId

complaints_bp = Blueprint('complaints', __name__)


# =========================
# STUDENT CREATE COMPLAINT
# =========================
@complaints_bp.route('', methods=['POST'])
@jwt_required()
@role_required('STUDENT')
def post_complaint():
    data = request.get_json()

    complaint = {
        "student_id": get_jwt_identity(),
        "title": data['title'],
        "description": data['description'],
        "category": data.get('category', 'general'),
        "status": "PENDING",
        "assigned_to": None,
        "createdAt": datetime.utcnow()
    }

    mongo.db.complaints.insert_one(complaint)
    return jsonify(msg="Complaint created"), 201


# =========================
# WARDEN GET ALL COMPLAINTS
# (FIX: ObjectId issue + technician join)
# =========================
@complaints_bp.route('', methods=['GET'])
@jwt_required()
@role_required('WARDEN')
def get_all_complaints():
    data = list(mongo.db.complaints.find().sort("createdAt", -1))

    for c in data:
        c['_id'] = str(c['_id'])
        
        # 🔥 FIX: attach technician details
        if c.get("assigned_to"):
            try:
                tech = mongo.db.users.find_one(
                    {"_id": ObjectId(c["assigned_to"])}
                )
                if tech:
                    tech["_id"] = str(tech["_id"])
                    c["assigned_to"] = {
                        "_id": tech["_id"],
                        "name": tech.get("name")
                    }
            except:
                pass

    return jsonify(data), 200


# =========================
# WARDEN ASSIGN TECHNICIAN
# =========================
@complaints_bp.route('/<id>/assign', methods=['PATCH'])
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
# TECHNICIAN GET TASKS
# =========================
@complaints_bp.route('/assigned', methods=['GET'])
@jwt_required()
@role_required('TECHNICIAN')
def get_assigned():
    tech_id = get_jwt_identity()

    data = list(mongo.db.complaints.find({
        "assigned_to": str(tech_id)
    }).sort("createdAt", -1))

    for c in data:
        c['_id'] = str(c['_id'])

    return jsonify(data), 200


# =========================
# STATUS UPDATE (TECH + WARDEN)
# =========================
@complaints_bp.route('/<id>/status', methods=['PATCH'])
@jwt_required()
def update_status(id):
    data = request.get_json()

    mongo.db.complaints.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"status": data['status'].upper()}}
    )

    return jsonify(msg="Updated"), 200