import flask
import requests
import json
from flask import request, jsonify
from bs4 import BeautifulSoup
from flask_cors import CORS, cross_origin
import mysql.connector
import os
import binascii

db = mysql.connector.connect(
  host="35.202.25.174",
  user="root",
  password="V4lhalla*",
  database="cryptrak"
)
app = flask.Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config["DEBUG"] = True


#USER HANDLING

#Attempt to create a user with the specified email and password
def create_user(email, password):
    exists = user_exists(email)
    if len(exists) > 0:
        return { 'error': 'User already exists.' }
    cursor = db.cursor()
    sql = "INSERT INTO users (email, password) VALUES (%s, %s)"
    val = (email, password)
    cursor.execute(sql, val)
    db.commit()
    user_id = user_exists(email)[0][0]
    login_token = set_login_token_for_user(user_id)
    return {'id': user_id, 'login_token': login_token}
    # else:
    #     return -1

#Attempt to sign in a user with the specified email and password
def log_in(email, password):
    exists = user_exists(email)
    if len(exists) == 0:
        return { 'error': 'User does not exist.' }
    cursor = db.cursor()
    sql = "SELECT id FROM users WHERE email = %s AND password = %s"
    val = (email, password)
    cursor.execute(sql, val)
    result = cursor.fetchone()
    if result is None:
        return {'error': 'incorrect password for user'}
    user_id = result[0]
    login_token = set_login_token_for_user(user_id)
    return {'id': user_id, 'login_token': login_token}

def log_in_with_token(user_id, login_token):
    cursor = db.cursor()
    sql = "SELECT email FROM users WHERE id = %s AND login_token = %s"
    val = (user_id, login_token)
    cursor.execute(sql, val)
    result = cursor.fetchone()
    if result is None:
        return {'status': 'invalid token for user'}
    return {'status': 'validated'}


def generate_login_token():
    return binascii.hexlify(os.urandom(10)).decode()


#Check if there is already a user with this email and return the id if so
def user_exists(email):
    cursor = db.cursor()
    sql = 'SELECT id FROM users WHERE email = %s'
    val = (email,)
    cursor.execute(sql, val)
    return cursor.fetchall()


#Attempt to confirm that the given user has the given login_token to validate the request
def validate_user(user_id, login_token):
    cursor = db.cursor()
    sql = "SELECT id FROM users WHERE id = %s AND login_token = %s"
    val = (user_id, login_token)
    cursor.execute(sql, val)
    return len(cursor.fetchall()) != 0

#Update the login token for the given user
def set_login_token_for_user(user_id):
    cursor = db.cursor()
    token = generate_login_token()
    sql = "UPDATE users SET login_token = %s WHERE id = %s"
    val = (token, user_id)
    cursor.execute(sql, val)
    db.commit()
    cursor.fetchall()
    return token

#WATCHED TOKEN HANDLING

#Get all watched tokens for a given user
def get_watched_for_user_id(user_id, login_token):
    if validate_user(user_id, login_token) == False:
        return False
    cursor = db.cursor()
    sql = "SELECT token_symbol FROM watched WHERE user_id = %s"
    val = (user_id,)
    cursor.execute(sql, val)
    return cursor.fetchall()

#Add new watched token for user
def add_watched_for_user_id(user_id, symbol, login_token):
    if validate_user(user_id, login_token) == False:
        return False
    cursor = db.cursor()
    sql = "INSERT INTO watched (user_id, token_symbol) VALUES (%s, %s)"
    val = (user_id, symbol)
    cursor.execute(sql, val)
    db.commit()

#Delete a watched token for user
def delete_watched_for_user_id(user_id, symbol, login_token):    
    if validate_user(user_id, login_token) == False:
        return False
    cursor = db.cursor()
    sql = "DELETE FROM watched WHERE user_id = %s AND token_symbol = %s"
    val = (user_id, symbol)
    cursor.execute(sql, val)
    db.commit()



#Add new transaction for user
def add_transaction_for_user_id(user_id, symbol, amount, price, login_token):
    if validate_user(user_id, login_token) == False:
        return False
    cursor = db.cursor()
    sql = "INSERT INTO transactions (user_id, token_symbol) VALUES (%s, %s)"
    val = (email, password)
    cursor.execute(sql, val)
    db.commit()

#Delete a transaction for user
def delete_transaction_for_user_id(user_id, symbol, amount, price, login_token):    
    if validate_user(user_id, login_token) == False:
        return False
    cursor = db.cursor()
    sql = "DELETE FROM transactions WHERE id = %s AND token_symbol = %s"
    salt = "TODO"
    val = (email, password)
    cursor.execute(sql, val)
    db.commit()

#Get all transactions for a given user
def get_transactions_for_user_id(user_id, login_token):
    if validate_user(user_id, login_token) == False:
        return False
    cursor = db.cursor()
    sql = "SELECT token_symbol FROM transactions WHERE id = %s"
    val = (user_id)
    cursor.execute(sql, val)
    result = cursor.fetchall()
    return result


#Get all token data 
def fetch_token_data(page_num=None):
    url = 'https://www.coinmarketcap.com'
    if page_num is not None:
        url = url + "/?page=" + str(page_num)
    html_text = requests.get(url).text
    soup = BeautifulSoup(html_text, 'html5lib')
    #stored on the CMC server as __NEXT_DATA__ JSON
    raw_data = (soup.find(id='__NEXT_DATA__').string)
    data_JSON = json.loads(raw_data)
    #extract the pricing data from the page config JSON
    price_dict = data_JSON['props']['initialState']['cryptocurrency']['listingLatest']['data']

    formatted_data = {}

    for idx, price_data in enumerate(price_dict):
        token_symbol = price_data['symbol'] #get token symbol (BTC)
        token_name = price_data['name'] #get token name (Bitcoin)
        time_of_record = price_data['lastUpdated']
        pricing_data = price_data['quote']['USD']
        new_token_dict = {"rank": idx + 1, "time": time_of_record, "name": token_name, "data": pricing_data}
        formatted_data[token_symbol] = new_token_dict
    return formatted_data

# Get current data for a given Symbol, e.g. 'BTC'
def get_token_data(token_symbol=None):
    if token_symbol is None:
        return
    return fetch_token_data()[token_symbol]

#Wrapper function for getting price for a given symbol, e.g. 'BTC'
def get_token_price(token_symbol=None):
    if token_symbol is None:
        return
    return fetch_token_data(token_symbol).data.price




#API CALLS


@app.route('/', methods=['GET'])

#Return the top 100 tokens by marketcap in JSON
@app.route('/api/v1/tokenprices', methods=['GET'])
@cross_origin()
def api_all_tokens():
    token_prices = fetch_token_data()
    return jsonify(token_prices)


#Check if the current user exists
@app.route('/exists', methods=['POST'])
@cross_origin()
def api_exists():
    data = request.json # a multidict containing POST data
    email = data['email']
    #TODO: DETERMINE THE STATUS OF THE REQUEST AND RETURN THE COEE ACCORDINGLY
    return jsonify(user_exists(email))

#Attempt to register the user with the given email and password 
@app.route('/register', methods=['POST'])
@cross_origin()
def api_register():
    data = request.json # a multidict containing POST data
    email = data['email']
    password = data['password']
    if email is None or password is None:
        return #TODO: return a properly formatted error for robustness
    #TODO: DETERMINE THE STATUS OF THE REQUEST AND RETURN THE HTTP CODE ACCORDINGLY
    return jsonify(create_user(email, password))

#Attempt to register the user with the given email and password 
@app.route('/login', methods=['POST'])
@cross_origin()
def api_login():
    data = request.json # a multidict containing POST data
    email = data['email']
    password = data['password']
    if email is None or password is None:
        return {'error': 'malformed data'} #TODO: return a properly formatted error for robustness
    #TODO: DETERMINE THE STATUS OF THE REQUEST AND RETURN THE HTTP CODE ACCORDINGLY
    return jsonify(log_in(email, password))


#Attempt to register the user with the given email and password 
@app.route('/validatetoken', methods=['POST'])
@cross_origin()
def api_validate_token():
    data = request.json # a multidict containing POST data
    user_id = data['id']
    login_token = data['token']
    if user_id is None or login_token is None:
        return {'error': 'malformed data'} #TODO: return a properly formatted error for robustness
    #TODO: DETERMINE THE STATUS OF THE REQUEST AND RETURN THE HTTP CODE ACCORDINGLY
    return jsonify(log_in_with_token(user_id, login_token))


#Get the given user's watchlist
@app.route('/getwatched', methods=['POST'])
@cross_origin()
def api_get_watched():
    data = request.json # a multidict containing POST data
    user_id = data['id']
    login_token = data['token']
    return jsonify(get_watched_for_user_id(user_id, login_token))
    #TODO: DETERMINE THE STATUS OF THE REQUEST AND RETURN THE HTTP CODE ACCORDINGLY


#Attempt to add the given token to the given user's watchlist
@app.route('/watchtoken', methods=['POST'])
@cross_origin()
def api_add_watched():
    data = request.json # a multidict containing POST data
    user_id = data['id']
    symbol = data['symbol']
    login_token = data['token']
    return jsonify(add_watched_for_user_id(user_id, symbol, login_token))
    #TODO: DETERMINE THE STATUS OF THE REQUEST AND RETURN THE HTTP CODE ACCORDINGLY


@app.route('/unwatchtoken', methods=['POST'])
@cross_origin()
def api_del_watched():
    data = request.json # a multidict containing POST data
    user_id = data['id']
    symbol = data['symbol']
    login_token = data['token']
    return jsonify(delete_watched_for_user_id(user_id, symbol, login_token))
    #TODO: DETERMINE THE STATUS OF THE REQUEST AND RETURN THE HTTP CODE ACCORDINGLY


app.run(host="localhost", port=5000, debug=True)
