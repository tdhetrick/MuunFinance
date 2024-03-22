from sqlalchemy import JSON, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from modules.database import db

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    user_id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    full_name = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


    categories = relationship("Category", backref="user")
    accounts = relationship("Account", backref="user")
    transactions = relationship("Transaction", backref="user")
    budgets = relationship("Budget", backref="user")
    transaction_imports = relationship("TransactionImport", backref="user")
    settings = relationship("Setting", backref="user")
    logs = relationship("Log", backref="user")

class Category(db.Model):
    __tablename__ = 'categories'
    
    category_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey('users.user_id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    

class Account(db.Model):
    __tablename__ = 'accounts'
    
    account_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey('users.user_id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    balance = db.Column(db.Float, nullable=False)
    account_type = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    transactions = relationship("Transaction", backref="account")

class Transaction(db.Model):
    __tablename__ = 'transactions'
    
    transaction_id = db.Column(db.Integer, primary_key=True)
    account_id = db.Column(db.Integer, ForeignKey('accounts.account_id'), nullable=False)
    category_id = db.Column(db.Integer, ForeignKey('categories.category_id'))
    user_id = db.Column(db.Integer, ForeignKey('users.user_id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    type = db.Column(db.String(50), nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    description = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    category = relationship("Category")

class Budget(db.Model):
    __tablename__ = 'budgets'
    
    budget_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey('users.user_id'), nullable=False)
    category_id = db.Column(db.Integer, ForeignKey('categories.category_id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    category = relationship("Category")


class TransactionImport(db.Model):
    __tablename__ = 'transaction_imports'
    
    import_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey('users.user_id'), nullable=False)
    account_id = db.Column(db.Integer, ForeignKey('accounts.account_id'), nullable=False)
    filename = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Setting(db.Model):
    __tablename__ = 'settings'
    
    setting_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey('users.user_id'), nullable=False)
    key = db.Column(db.String(100), nullable=False)
    value = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Log(db.Model):
    __tablename__ = 'logs'
    
    log_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey('users.user_id'))
    event_type = db.Column(db.String(100), nullable=False)
    event_description = db.Column(db.String(255))
    ip_address = db.Column(db.String(100))
    user_agent = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    


class ImportConfig(db.Model):
    __tablename__ = 'import_configs'

    config_id = db.Column(db.Integer, primary_key=True)
    account_id = db.Column(db.Integer, ForeignKey('accounts.account_id'), nullable=False)
    delimiter = db.Column(db.String(10), nullable=False)
    date_format = db.Column(db.String(50), nullable=False)
    column_mapping = db.Column(JSON)

    account = relationship("Account", backref="import_configs")
