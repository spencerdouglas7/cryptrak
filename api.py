import flask
import requests
import json
from flask import request, jsonify
from bs4 import BeautifulSoup
from flask_cors import CORS, cross_origin

app = flask.Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config["DEBUG"] = True



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
        new_token_dict = {"rank": idx + 1, "time": time_of_record, "name": token_name, "info": pricing_data}
        formatted_data[token_symbol] = new_token_dict
    return formatted_data

# Get current data for a given Symbol, e.g. 'BTC'
def get_token_data(token_symbol=None):
    if token_symbol is None:
        return
    return fetch_token_data()[token_symbol]


@app.route('/', methods=['GET'])

# A route to return the top 100 tokens by marketcap
@app.route('/api/v1/tokenprices', methods=['GET'])
@cross_origin()
def api_all():
    token_prices = fetch_token_data()
    return jsonify(token_prices)

app.run(host="localhost", port=5000, debug=True)
