from db_utils import swen_344_db_utils as db_utils

def get_clubs():
	"""Returns: A list of dictionaries mapping field names to their value for all clubs"""
	return db_utils.exec_get_all_rows("SELECT * FROM clubs")

def get_club(club_id):
	"""Returns: A dictionary mapping field names to their value for the retrieved club or None club_id is invalid"""
	if not isinstance(club_id, int):
		raise TypeError(f"Expected an integer for the argument club_id. Got {club_id}")

	club = db_utils.exec_get_first_row(
		"""
			SELECT * FROM clubs
				WHERE id = %(clubd_id)s
		""",
		{'club_id': club_id}
	)

	return club

def update_club(club_id, name=None, location=None, music_genre=None, max_capacity=None, yellow_threshold=None, occupancy=None):
	"""Returns: A dictionary mapping field names to their value for the updated club or None club_id is invalid"""
	if club_id is not None and not isinstance(club_id, int):
		raise TypeError(f"Expected an integer for the argument club_id. Got {club_id}")
	elif max_capacity is not None and not isinstance(max_capacity, int):
		raise TypeError(f"Expected an integer for the argument max_capacity. Got {max_capacity}")
	elif yellow_threshold is not None and not isinstance(yellow_threshold, int):
		raise TypeError(f"Expected an integer for the argument yellow_threshold. Got {yellow_threshold}")
	elif occupancy is not None and not isinstance(occupancy, int):
		raise TypeError(f"Expected an integer for the argument occupancy. Got {occupancy}")

	updated_club = db_utils.exec_commit_return_row(
		"""
			UPDATE clubs
				SET
					name = COALESCE(%(name)s, name),
					location = COALESCE(%(location)s, location),
					music_genre = COALESCE(%(music_genre)s, music_genre),
					max_capacity = COALESCE(%(max_capacity)s, max_capacity),
					yellow_threshold = COALESCE(%(yellow_threshold)s, yellow_threshold),
					occupancy = COALESCE(%(occupancy)s, occupancy)
				WHERE
					id = %(club_id)s
				RETURNING *
		""",
		{
			'club_id': club_id,
			'name': name,
			'location': location,
			'music_genre': music_genre,
			'max_capacity': max_capacity,
			'yellow_threshold': yellow_threshold,
			'occupancy': occupancy,
		}
	)

	return updated_club

def create_club(name, location, music_genre, max_capacity, yellow_threshold):
	"""Returns: A dictionary mapping field names to their value for the created club"""
	if max_capacity is not None and not isinstance(max_capacity, int):
		raise TypeError(f"Expected an integer for the argument max_capacity. Got {max_capacity}")
	elif yellow_threshold is not None and not isinstance(yellow_threshold, int):
		raise TypeError(f"Expected an integer for the argument yellow_threshold. Got {yellow_threshold}")

	created_club = db_utils.exec_commit_return_row(
		"""
			INSERT INTO clubs(name, location, music_genre, max_capacity, yellow_threshold) VALUES
				(%(name)s, %(location)s, %(music_genre)s, %(max_capacity)s, %(yellow_threshold)s)
				RETURNING *
		""",
		{
			'name': name,
			'location': location,
			'music_genre': music_genre,
			'max_capacity': max_capacity,
			'yellow_threshold': yellow_threshold,
		}
	)

	return created_club

def delete_club(club_id):
	"""Returns: A dictionary mapping field names to their value for the deleted club or None club_id is invalid"""
	if not isinstance(club_id, int):
		raise TypeError(f"Expected an integer for the argument club_id. Got {club_id}")

	deleted_user = db_utils.exec_commit_return_row(
		"""
			DELETE FROM clubs
				WHERE id = %(club_id)s
				RETURNING *
		""",
		{'club_id': club_id}
	)

	return deleted_user