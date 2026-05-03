from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from ..extensions import mongo
from bson import ObjectId

def role_required(role):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user_id = get_jwt_identity()
            user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
            if not user or user.get('role', '').upper() != role.upper():
                return jsonify({"msg": "Unauthorized access"}), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator