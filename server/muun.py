from flask import Flask, request, jsonify, make_response, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta
import os
from database import db


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
    hashed_password = generate_password_hash(data['password'], method='sha256')
    new_user = User(email=data['email'], password_hash=hashed_password, full_name=data['full_name'])
    
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully.'}), 201

@app.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not check_password_hash(user.password_hash, data['password']):
        return make_response('Could not verify', 401, {'WWW-Authenticate': 'Basic realm="Login required!"'})

    access_token = create_access_token(identity=user.user_id)
    refresh_token = create_refresh_token(identity=user.user_id)

    return jsonify({'access_token': access_token, 'refresh_token': refresh_token}), 200

if __name__ == '__main__':
    app.run(debug=True)
