import mysql.connector
import os

mydb = mysql.connector.connect(
  host="34.72.13.87",
  user="root",
  password="V4lhalla*",
  database="cryptrak"
)

#USER HANDLING

def create_user(email, password):
  mycursor = mydb.cursor()

  sql = "INSERT INTO users (email, password, salt) VALUES (%s, %s, %s)"
  salt = "TODO"
  val = (email, password, salt)
  mycursor.execute(sql, val)
  mydb.commit()
  print(mycursor.rowcount, "record inserted.")
  if (mycursor.rowcount > 0)
    return generate_login_token()
  else return "operation failed"

def generate_login_token():
    return binascii.hexlify(os.urandom(20)).decode()

def user_exists(email):
  cursor = mydb.cursor()

  sql = "SELECT user FROM watched WHERE email = (%s)"
  val = (email)
  cursor.execute(sql, val)]
  return (cursor.rowcount != 0)


def validate_user(id, login_token):


#WATCHED TOKEN HANDLING

def get_watched_for_user_id(id, login_token):
  cursor = mydb.cursor()
  sql = "SELECT token_symbol FROM watched WHERE user_id = (%s)"
  val = (user_id)
  cursor.execute(sql, val)
  result = cursor.fetchall()
  return result

def get_transactions_for_user_id(id, login_token):
  

def add_transaction_for_user_id(id, login_token):

def add_watched_for_user_id(id, login_token):  


