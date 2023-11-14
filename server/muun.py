from flask import Flask, request, jsonify, make_response, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, get_jwt_identity, jwt_required
from flask_bcrypt import Bcrypt
from datetime import timedelta
import os
from database import db
import bcrypt

app = Flask(__name__)

from model import *


# Configure Flask app
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///muun.db'
app.config['JWT_SECRET_KEY'] = 'darthMaulIsMuun'  
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)  



jwt = JWTManager(app)


db.init_app(app)
with app.app_context():
    db.create_all()  
    
@app.route('/')  # This route handles the default page
def index():
    return send_from_directory(os.path.join(app.root_path, '..', 'public'), 'index.html')
      
@app.route('/<path:filename>')
def base_static(filename):
    public_folder = os.path.join(app.root_path, '..', 'public')
    return send_from_directory(public_folder, filename)

@app.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
    #hashed_password = generate_password_hash(data['password'], method='sha256')
    new_user = User(email=data['email'], password_hash=hashed_password, full_name=data['full_name'])
    
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully.'}), 201

@app.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not bcrypt.checkpw( data['password'].encode('utf-8'),user.password_hash):
    #check_password_hash(user.password_hash, data['password']):
        return make_response('Could not verify', 401, {'WWW-Authenticate': 'Basic realm="Login required!"'})

    access_token = create_access_token(identity=user.user_id)
    refresh_token = create_refresh_token(identity=user.user_id)

    return jsonify({'access_token': access_token, 'refresh_token': refresh_token}), 200

@app.route('/add_account', methods=['POST'])
@jwt_required()
def add_account():
    current_user_id = get_jwt_identity()
    data = request.json

    # You should validate your input data in a real application
    new_account = Account(
        user_id=current_user_id,
        name=data.get('name'),
        balance=data.get('balance', 0.0),
        account_type=data.get('account_type')
    )

    db.session.add(new_account)
    try:
        db.session.commit()
        return jsonify({"message": "Account created successfully."}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
@app.route('/accounts', methods=['GET'])
@jwt_required()
def get_accounts():
    current_user_id = get_jwt_identity()  # Assuming the user identity is stored in the JWT

    try:
        # Query for accounts belonging to the current user
        accounts = Account.query.filter_by(user_id=current_user_id).all()
        account_list = [
            {'account_id': acc.account_id, 'name': acc.name, 'balance': acc.balance, 'account_type': acc.account_type}
            for acc in accounts
        ]
        return jsonify(account_list), 200
    except Exception as e:
        # Handle exceptions
        return jsonify({'error': str(e)}), 500    

if __name__ == '__main__':
    app.run(debug=True)
