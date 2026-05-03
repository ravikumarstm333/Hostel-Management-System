from flask import Blueprint, request, jsonify
from ..extensions import mongo, bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.utils.decorators import role_required
from bson import ObjectId

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({"msg": "No input data provided"}), 400

    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'STUDENT').upper()

    if not name or not email or not password:
        return jsonify({"msg": "Name, email and password are required"}), 400

    # Check if user already exists
    existing = mongo.db.users.find_one({"email": email})
    if existing:
        return jsonify({"msg": "User already exists with this email"}), 409

    hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')
    user_id = mongo.db.users.insert_one({
        "name": name,
        "email": email,
        "password": hashed_pw,
        "role": role
    }).inserted_id
    
    access_token = create_access_token(identity=str(user_id))
    return jsonify({
        "token": access_token,
        "role": role,
        "name": name,
        "id": str(user_id)
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"msg": "No input data provided"}), 400

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"msg": "Email and password are required"}), 400

    user = mongo.db.users.find_one({"email": email})
    if not user or not bcrypt.check_password_hash(user['password'], password):
        return jsonify({"msg": "Invalid credentials"}), 401

    access_token = create_access_token(identity=str(user['_id']))
    return jsonify({
        "token": access_token,
        "role": user.get('role', 'STUDENT').upper(),
        "name": user.get('name'),
        "id": str(user['_id'])
    }), 200


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    from bson import ObjectId
    user_id = get_jwt_identity()
    user = mongo.db.users.find_one({"_id": ObjectId(user_id)}, {"password": 0})
    if not user:
        return jsonify({"msg": "User not found"}), 404
    user['_id'] = str(user['_id'])
    return jsonify(user), 200

@auth_bp.route('/students', methods=['GET'])
@jwt_required()
@role_required('WARDEN')
def get_students():
    students = list(mongo.db.users.find({"role": "STUDENT"}, {"password": 0}))
    for s in students:
        s['_id'] = str(s['_id'])
    return jsonify(students), 200

@auth_bp.route('/technicians', methods=['GET'])
@jwt_required()
@role_required('WARDEN')
def get_technicians():
    techs = list(mongo.db.users.find({"role": "TECHNICIAN"}, {"password": 0}))
    for t in techs:
        t['_id'] = str(t['_id'])
    return jsonify(techs), 200
