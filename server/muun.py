from flask import Flask, request, jsonify, make_response, send_from_directory, session
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func, extract
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, get_jwt_identity, jwt_required,unset_jwt_cookies
from flask_bcrypt import Bcrypt
from datetime import timedelta
import os
from database import db
import bcrypt

app = Flask(__name__)
app.secret_key = 'darthMaulIsMuun'

from model import *


# Configure Flask app
#app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///muun.db'

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://muun:m00nf!nanc3@127.0.0.1/muunfinance'

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

    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({'message': 'Email already exists.'}), 409
    
    if data['reg_code'] != 'UNCC':
        return jsonify({'message': 'Incorrect Registration Code.'}), 400


    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
    #hashed_password = generate_password_hash(data['password'], method='sha256')

    new_user = User(email=data['email'], password_hash=hashed_password, full_name=data['full_name'])
    
    db.session.add(new_user)
    try:
        db.session.commit()
        return jsonify({'message': 'User created.'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not bcrypt.checkpw(data['password'].encode('utf-8'),user.password_hash.encode('utf-8')):
    
        return make_response('Could not verify', 401)

    access_token = create_access_token(identity=user.user_id)
    refresh_token = create_refresh_token(identity=user.user_id)

    return jsonify({'access_token': access_token, 'refresh_token': refresh_token}), 200

@app.route('/logout', methods=['POST'])
def logout():
    
    session.clear() #doing this, not sure if I will use flask session, but just fot safety

    response = jsonify({"msg": "Logout successful"})
    unset_jwt_cookies(response)  

    return response

#****************  ACCOUNTS ************

@app.route('/add_account', methods=['POST'])
@jwt_required()
def add_account():
    current_user_id = get_jwt_identity()
    data = request.json

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
    current_user_id = get_jwt_identity() 

    try:
        
        accounts = Account.query.filter_by(user_id=current_user_id).all()
        account_list = [
            {'account_id': acc.account_id, 'name': acc.name, 'balance': acc.balance, 'account_type': acc.account_type}
            for acc in accounts
        ]
        return jsonify(account_list), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500   
    
@app.route('/accounts_balance', methods=['GET'])
@jwt_required()
def get_accounts_balance():
    current_user_id = get_jwt_identity() 

    try:

        accounts = Account.query.filter_by(user_id=current_user_id).all()
        account_list = []
        
        for acc in accounts:
               
            transaction_sum = db.session.query(func.coalesce(func.sum(Transaction.amount), 0)).filter_by(account_id=acc.account_id).scalar()
            current_balance = acc.balance + transaction_sum

            account_list.append({
                'account_id': acc.account_id,
                'name': acc.name,
                'balance': current_balance,
                'account_type': acc.account_type
            })
        
        return jsonify(account_list), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500      
 
 
 #****************  CATEGORY  ************
    
@app.route('/add_category', methods=['POST'])
@jwt_required()
def add_category():
    current_user_id = get_jwt_identity()
    data = request.json

    new_category = Category(
        user_id=current_user_id,
        name=data.get('name'),
        description=data.get('description', "")       
    )

    db.session.add(new_category)
    try:
        db.session.commit()
        return jsonify({"message": "Category created successfully."}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500  

@app.route('/categories', methods=['GET'])
@jwt_required()
def get_categories():
    current_user_id = get_jwt_identity()  # Assuming the user identity is stored in the JWT

    try:      
        categories = Category.query.filter_by(user_id=current_user_id).all()
        category_list = [
            {'category_id': cat.category_id, 'name': cat.name, 'description': cat.description}
            for cat in categories
        ]
        return jsonify(category_list), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500 
    
@app.route('/category_totals', methods=['GET'])
@jwt_required()
def get_category_totals():
    current_user_id = get_jwt_identity()

    try:        
        category_totals = db.session.query(
            Category.name,
            func.sum(Transaction.amount).label('total_spent')
        ).join(Transaction, Category.category_id == Transaction.category_id)\
         .filter(Transaction.user_id == current_user_id)\
         .group_by(Category.name)\
         .all()

       
        category_totals_list = [
            {'category': cat.name, 'total_spent': cat.total_spent}
            for cat in category_totals
        ]

        return jsonify(category_totals_list), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500              
  
 #****************  BUDGET  ************
 
@app.route('/add_budget', methods=['POST'])
@jwt_required()
def add_budget():
    current_user_id = get_jwt_identity()
    data = request.json
    print(data)
    new_budget = Budget(
        user_id=current_user_id,
        category_id=data.get('category_id'),
        amount=data.get('amount', 0)       
    )

    db.session.add(new_budget)
    try:
        db.session.commit()
        return jsonify({"message": "Budget created successfully."}), 201
    except Exception as e:
        db.session.rollback()
        print(str(e))
        return jsonify({"error": str(e)}), 500   
    
@app.route('/budgets', methods=['GET'])
@jwt_required()
def get_budgets():
    current_user_id = get_jwt_identity()  # Assuming the user identity is stored in the JWT

    try:      
        budgets = Budget.query.filter_by(user_id=current_user_id).all()

        budget_list = [
            {'budget_id': bud.budget_id, 'amount': bud.amount ,"category": { "category_id": bud.category.category_id,"name": bud.category.name,}}
            for bud in budgets
        ]
        return jsonify(budget_list), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500  
    
@app.route('/budget_totals', methods=['GET'])
@jwt_required()
def get_budget_totals():
    current_user_id = get_jwt_identity()

    try:
        
        budgets = Budget.query.filter_by(user_id=current_user_id).all()
        budget_totals = []

        for budget in budgets:
            
            total_spent = db.session.query(func.sum(Transaction.amount)).filter(
                Transaction.category_id == budget.category_id,
                Transaction.user_id == current_user_id
            ).scalar() or 0

            budget_totals.append({
                'budget_id':budget.budget_id,
                'category': budget.category.name,
                'budget_goal': budget.amount,
                'total_spent': total_spent
            })

        return jsonify(budget_totals), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
 #****************  TRANSACTIONS  ************  
 
@app.route('/add_transaction', methods=['POST'])
@jwt_required()
def add_transaction():
    current_user_id = get_jwt_identity()
    data = request.json
    
    print(data)
    
    new_transaction = Transaction(
        user_id=current_user_id,
        category_id=data.get('category_id'),       
        account_id =data.get('account_id'),  
        amount = data.get('amount'),  
        type = data.get('type'),  
        date = datetime.strptime(data.get('date',None), '%Y-%m-%d'),  
        description = data.get('description'),  
        )

    db.session.add(new_transaction)
    try:
        db.session.commit()
        return jsonify({"message": "Transaction created successfully."}), 201
    except Exception as e:
        db.session.rollback()
        print(str(e))
        return jsonify({"error": str(e)}), 500    
    
@app.route('/transactions', methods=['GET'])
@jwt_required()
def get_transactions():
    current_user_id = get_jwt_identity()  # Assuming the user identity is stored in the JWT

    try:      
        budgets = Transaction.query.filter_by(user_id=current_user_id).all()

        transactions = [
            {'transaction_id': tr.transaction_id, 'amount': tr.amount ,'type': tr.type ,'date': tr.date.strftime('%m/%d/%Y') ,"category":  tr.category.name, 'account':tr.account.name}
            for tr in budgets
        ]
        return jsonify(transactions), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500    
    
@app.route('/update_transaction/<int:transaction_id>', methods=['PUT'])
@jwt_required()
def update_transaction(transaction_id):
    current_user_id = get_jwt_identity()
    data = request.json

    transaction = Transaction.query.filter_by(user_id=current_user_id, transaction_id=transaction_id).first()

    if not transaction:
        return jsonify({"message": "Transaction not found."}), 404

    transaction.category_id = data.get('category_id', transaction.category_id)
    transaction.account_id = data.get('account_id', transaction.account_id)
    transaction.amount = data.get('amount', transaction.amount)
    transaction.type = data.get('type', transaction.type)
    transaction.date = datetime.strptime(data.get('date'), '%Y-%m-%d') if data.get('date') else transaction.date
    transaction.description = data.get('description', transaction.description)

    try:
        db.session.commit()
        return jsonify({"message": "Transaction updated successfully."}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500  
    
    
@app.route('/monthly_net_income', methods=['GET'])
@jwt_required()
def get_monthly_net_income():
    current_user_id = get_jwt_identity()

    try:
        # Aggregate transaction amounts by month and type
        monthly_totals = db.session.query(
            extract('year', Transaction.date).label('year'),
            extract('month', Transaction.date).label('month'),
            Transaction.type,
            func.sum(Transaction.amount).label('total')
        ).filter_by(
            user_id=current_user_id
        ).group_by(
            'year', 'month', Transaction.type
        ).all()
        print(monthly_totals)
        # Prepare the net income data
        net_income_data = {}
        for year, month, type, total in monthly_totals:
            year_month = f"{year}-{month:02d}"
            if year_month not in net_income_data:
                net_income_data[year_month] = {'date':year_month,'credits': 0, 'debits': 0, 'net': 0}
            
            if type.lower() == 'credit':
                net_income_data[year_month]['credits'] += total
            elif type.lower() == 'debit':
                net_income_data[year_month]['debits'] += total

            net_income_data[year_month]['net'] = net_income_data[year_month]['credits'] - net_income_data[year_month]['debits']
        final = list(net_income_data.values())    
        print(final)
        return jsonify(final), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500   
        
    
if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True)
