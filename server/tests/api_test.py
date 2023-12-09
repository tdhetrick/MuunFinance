import pytest
from muun import app
from flask import json

@pytest.fixture
def client():
    #app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_successful_login(client):
    """ Test login with correct credentials """
    response = client.post('/login', json={
        'email': 'todd@todd.com',
        'password': '123456'
    })
    assert response.status_code == 200
    assert 'access_token' in json.loads(response.data)
    assert 'refresh_token' in json.loads(response.data)

def test_failed_login(client):
    """ Test login with incorrect credentials """
    response = client.post('/login', json={
        'email': 'todd@todd.com',
        'password': 'badpass'
    })
    assert response.status_code == 401
    assert 'Could not verify' in response.data.decode()

def test_login_with_missing_data(client):
    """ Test login with missing data """
    response = client.post('/login', json={
        'email': 'user@example.com'
        
    })
    assert response.status_code == 400  
