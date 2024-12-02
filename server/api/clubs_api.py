from flask import jsonify
from flask_restful import Resource
from db_utils import club_db_utils, swen_344_db_utils as db_utils
from api import http_request_data_utils

class ClubsApi(Resource):
	"""/clubs"""
	def get(self):
		clubs = club_db_utils.get_clubs()
		return jsonify(clubs)

	def post(self):
		body = http_request_data_utils.get_json_body()
		name = body.get('name')
		location = body.get('location')
		music_genre = body.get('music_genre')
		max_capacity = body.get('max_capacity')
		yellow_threshold = body.get('yellow_threshold')

		if (
			name is None or
			location is None or
			music_genre is None or
			max_capacity is None or
			yellow_threshold is None
		):
			return jsonify({"error": f"Request body is missing one of the following: 'name', 'location', 'music_genre', 'max_capacity', 'yellow_threshold'."}), 400

		if max_capacity is not None:
			try:
				max_capacity = int(max_capacity)
			except ValueError:
				return jsonify({"error": f"Invalid 'max_capacity' in the request body: {max_capacity}. Expected an integer."}), 400

		if yellow_threshold is not None:
			try:
				yellow_threshold = int(yellow_threshold)
			except ValueError:
				return jsonify({"error": f"Invalid 'yellow_threshold' in the request body: {yellow_threshold}. Expected an integer."}), 400

		created_club = club_db_utils.create_club(name, location, music_genre, max_capacity, yellow_threshold)
		print(created_club)
		return created_club

class ClubApi(Resource):
	"""/clubs/{id}"""
	def get(self, club_id):
		try:
			club = club_db_utils.get_club()
		except TypeError:
			return jsonify({"error": f"Invalid club id: {club_id}. Must be an integer."}), 400

		if club is None:
			return jsonify({"error": f"Club with id {club_id} not found."}), 404
		else:
			return club

	def put(self, club_id):
		body = http_request_data_utils.get_json_body()
		name = body.get('name')
		location = body.get('location')
		music_genre = body.get('music_genre')
		max_capacity = body.get('max_capacity')
		yellow_threshold = body.get('yellow_threshold')
		occupancy = body.get('occupancy')

		if (
			name is None and
			location is None and
			music_genre is None and
			max_capacity is None and
			yellow_threshold is None and
			occupancy is None
		):
			return jsonify({"error": f"No data provided in the request body."}), 400
			
		if max_capacity is not None:
			try:
				max_capacity = int(max_capacity)
			except ValueError:
				return jsonify({"error": f"Invalid 'max_capacity' in the request body: {max_capacity}. Expected an integer."}), 400

		if yellow_threshold is not None:
			try:
				yellow_threshold = int(yellow_threshold)
			except ValueError:
				return jsonify({"error": f"Invalid 'yellow_threshold' in the request body: {yellow_threshold}. Expected an integer."}), 400

		if occupancy is not None:
			try:
				occupancy = int(occupancy)
			except ValueError:
				return jsonify({"error": f"Invalid 'occupancy' in the request body: {occupancy}. Expected an integer."}), 400

		print(type(yellow_threshold))
		print(yellow_threshold)

		try:
			updated_club = club_db_utils.update_club(club_id, name=name, location=location, music_genre=music_genre, max_capacity=max_capacity, yellow_threshold=yellow_threshold, occupancy=occupancy)
			return updated_club
		except TypeError as error:
			return jsonify({"error": error}), 400

	def delete(self, club_id):
		try:
			deleted_club = club_db_utils.delete_club(club_id)
		except TypeError:
			return jsonify({"error": f"Invalid club id: {club_id}. Must be an integer."}), 400

		return deleted_club



