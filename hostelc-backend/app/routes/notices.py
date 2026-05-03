from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from ..extensions import mongo
from app.utils.decorators import role_required
from datetime import datetime

notices_bp = Blueprint('notices', __name__)

@notices_bp.route('', methods=['GET'])
@jwt_required()
def get_notices():
    notices = list(mongo.db.notices.find().sort("created_at", -1))
    for n in notices: n['_id'] = str(n['_id'])
    return jsonify(notices), 200

@notices_bp.route('', methods=['POST'])
@jwt_required()
@role_required('WARDEN')
def post_notice():
    data = request.get_json()
    notice = {
        "title": data['title'],
        "content": data['content'],
        "created_at": datetime.utcnow()
    }
    mongo.db.notices.insert_one(notice)
    return jsonify(msg="Notice posted"), 201