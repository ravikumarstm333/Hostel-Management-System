from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import mongo
from app.utils.decorators import role_required
from datetime import datetime
from bson import ObjectId

mess_bp = Blueprint('mess', __name__)

# =========================
# STUDENT: PLACE FOOD ORDER
# =========================
@mess_bp.route('/orders', methods=['POST'])
@jwt_required()
@role_required('STUDENT')
def post_food_order():
    data = request.get_json()
    
    required_fields = ['hostelName', 'roomNumber', 'foodItems']
    if not all(field in data for field in required_fields):
        return jsonify(msg="Missing required fields"), 400

    order = {
        "student_id": get_jwt_identity(),
        "hostelName": data['hostelName'],
        "roomNumber": data['roomNumber'],
        "foodItems": data['foodItems'],
        "quantity": data.get('quantity', 1),
        "status": "PENDING",
        "createdAt": datetime.utcnow()
    }

    mongo.db.food_orders.insert_one(order)
    return jsonify(msg="Order placed successfully"), 201

@mess_bp.route('/orders/my', methods=['GET'])
@jwt_required()
@role_required('STUDENT')
def get_my_orders():
    user_id = get_jwt_identity()
    orders = list(mongo.db.food_orders.find({"student_id": user_id}).sort("createdAt", -1))
    for o in orders:
        o['_id'] = str(o['_id'])
    return jsonify(orders), 200

# =========================
# MESS INCHARGE: MANAGE ORDERS
# =========================
@mess_bp.route('/orders', methods=['GET'])
@jwt_required()
@role_required('MESS_INCHARGE')
def get_all_orders():
    orders = list(mongo.db.food_orders.find().sort("createdAt", -1))
    for o in orders:
        o['_id'] = str(o['_id'])
        # Optional: Join with user to get student name
        try:
            user = mongo.db.users.find_one({"_id": ObjectId(o['student_id'])}, {"name": 1})
            if user:
                o['studentName'] = user.get('name')
        except:
            o['studentName'] = "Unknown"
            
    return jsonify(orders), 200

@mess_bp.route('/orders/<id>/status', methods=['PATCH'])
@jwt_required()
@role_required('MESS_INCHARGE')
def update_order_status(id):
    data = request.get_json()
    new_status = data.get('status', '').upper()
    
    valid_statuses = ["ACCEPTED", "REJECTED", "PREPARING", "DELIVERED"]
    if new_status not in valid_statuses:
        return jsonify(msg="Invalid status"), 400

    mongo.db.food_orders.update_one({"_id": ObjectId(id)}, {"$set": {"status": new_status}})
    return jsonify(msg=f"Order updated to {new_status}"), 200