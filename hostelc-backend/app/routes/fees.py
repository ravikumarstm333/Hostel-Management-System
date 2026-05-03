from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from ..extensions import mongo
from app.utils.decorators import role_required
from bson import ObjectId

fees_bp = Blueprint('fees', __name__)

@fees_bp.route('', methods=['GET'])
@jwt_required()
def get_fees():
    # This would typically join with users or be a separate collection
    fees = list(mongo.db.fees.find())
    for f in fees: 
        f['_id'] = str(f['_id'])
        f['student_id'] = str(f['student_id'])
    return jsonify(fees), 200

@fees_bp.route('/<student_id>/status', methods=['PATCH'])
@jwt_required()
@role_required('WARDEN')
def update_fee_status(student_id):
    data = request.get_json()
    mongo.db.fees.update_one(
        {"student_id": student_id},
        {"$set": {"status": data['status'].upper()}},
        upsert=True
    )
    return jsonify(msg="Fee status updated"), 200