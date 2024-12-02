
from flask import Flask
from flask_restful import Api
from flask_cors import CORS

from db_utils import swen_344_db_utils as db_utils
from api import clubs_api

flask_app = Flask(__name__)
CORS(flask_app) #Enable CORS on Flask server to work with Nodejs pages

main_api = Api(flask_app)

main_api.add_resource(clubs_api.ClubsApi, "/clubs")
main_api.add_resource(clubs_api.ClubApi, "/clubs/<int:club_id>")

if __name__ == "__main__":
	db_utils.exec_sql_file('setup_clubs_table_with_data.sql')
	flask_app.run(debug=True, port=5000)