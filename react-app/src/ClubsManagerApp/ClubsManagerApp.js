import { Button, Col, Container, DropdownItem, DropdownMenu, DropdownToggle, Input, InputGroup, Row, UncontrolledButtonDropdown } from 'reactstrap';
import Club from '../Club/Club';
import './ClubsManagerApp.css';
import React from 'react';
import { FaPlus } from 'react-icons/fa';
import ClubModal from '../ClubModal/ClubModal';

const HttpStatus = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
};

const BASE_API_URL = 'http://localhost:5000'
const CLUBS_API_URL = `${BASE_API_URL}/clubs`
const CLUB_API_URL = (club_id) => `${BASE_API_URL}/clubs/${club_id}`
const REQUEST_COOLDOWN_DURATION = 500 // Half a second

export default class ClubsManagerApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isCreatingClub: false,
			isAddingClub: false,
			isFetchingClub: false,
			locationFilter: undefined,
			possibleNewClub: {
				name: '',
				location: '',
				musicGenre: '',
				maxCapacity: 100,
				yellowThreshold: 80,
				occupancy: 0,
			},
			clubs: []
		}

		this.lastUpdateRequestTime = 0;
		this.updateClubTimeoutId = null;
	}

	get possibleNewClub() {
		return this.state.possibleNewClub;
	}

	set possibleNewClub(possibleNewClub) {
		this.setState({possibleNewClub: possibleNewClub});
	}

	get isAddingClub() {return this.state.isAddingClub;}
	set isAddingClub(isAddingClub) {this.setState({isAddingClub: isAddingClub});}

	get isFetchingClub() {return this.state.isFetchingClub;}
	set isFetchingClub(isFetchingClub) {this.setState({isFetchingClub: isFetchingClub});}

	/**
	 * Executed immediately after a component is added to DOM tree (Added to the screen)
	 */
	componentDidMount(){
		this.syncLocalClubsDataWithServer();
	}

	canSendUpdateRequest = () => {
		const cooldownTime = REQUEST_COOLDOWN_DURATION;
		const currentTime = Date.now();
		return currentTime - this.lastUpdateRequestTime >= cooldownTime;
	};

	updateLastRequestTime = () => {
		this.lastUpdateRequestTime =  Date.now();
	};

	syncLocalClubsDataWithServer = () => {
		this.isFetchingClub = true;

		fetch(CLUBS_API_URL)
			.then(httpResponse => {
				console.log(httpResponse);

				if (httpResponse.status === HttpStatus.OK)
					return httpResponse.json();
				else {
					console.error(`HTTP Error: ${httpResponse.status}:${httpResponse.statusText}`);
					return undefined;
				}
			})
			.then(jsonOutput => {
				if (jsonOutput !== undefined && Array.isArray(jsonOutput)) {
				  const clubsJson = jsonOutput;
					const localClubs = [];

					for (let clubJson of clubsJson) {
						const localClub = this.convertJsonClubToLocalClub(clubJson);
						localClubs.push(localClub);
					}

					this.setClubsLocalData(localClubs);
					console.log({localClubs});
				}

				this.isFetchingClub = false;
			})
			.catch(error => {
				console.error(error);
				this.isFetchingClub = false;
			})
	}

	setClubsLocalData = (clubs) => {
		const copyOfClubs = [...clubs];
		this.setState({clubs: copyOfClubs});
	}

	convertJsonClubToLocalClub = (jsonClub) => {
		const fieldMappings = {
			music_genre: 'musicGenre',
			max_capacity: 'maxCapacity',
			yellow_threshold: 'yellowThreshold',
		};

		const localClub = {...jsonClub}

		for (const [oldKey, newKey] of Object.entries(fieldMappings)) {
			if (localClub.hasOwnProperty(oldKey)) {
				localClub[newKey] = localClub[oldKey];
				delete localClub[oldKey];
			}
		}

		return localClub;
	}

	convertLocalClubToJsonClub = (localClub) => {
		const fieldMappings = {
			musicGenre: 'music_genre',
			maxCapacity: 'max_capacity',
			yellowThreshold: 'yellow_threshold',
		};

		const jsonClub = {...localClub}

		for (const [oldKey, newKey] of Object.entries(fieldMappings)) {
			if (jsonClub.hasOwnProperty(oldKey)) {
				jsonClub[newKey] = jsonClub[oldKey];
				delete jsonClub[oldKey];
			}
		}

		return jsonClub;
	}

	deleteClub = async (id) => {
		await this.deleteClubOnServer(id);
	}

	deleteClubOnServer = async (id) => {
		try {
			const httpResponse = await fetch(CLUB_API_URL(id), {
				method: 'DELETE',
			});

			console.log(httpResponse);

			if (httpResponse.status === HttpStatus.OK) {
				const deletedClub = await httpResponse.json();
				if (deletedClub) {
					this.deleteClubLocally(deletedClub.id);
				}
			}
			else {
				console.error(`HTTP Error: ${httpResponse.status}:${httpResponse.statusText}`);
			}
		}
		catch (error) {
			console.error(error);
		}
	}

	deleteClubLocally = (id) => {
		const newClubs = this.state.clubs.filter(club => club.id !== id);
		this.setState({clubs: newClubs});
	}

	createNewClub = () => {
		this.addClubToServer(this.possibleNewClub)
	}

	addClubToServer = (club) => {
		this.isAddingClub = true;

		const requestInfo = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(
				this.convertLocalClubToJsonClub(club)
			)
		};

		fetch(CLUBS_API_URL, requestInfo)
			.then(httpResponse => {
				console.log(httpResponse);

				if (httpResponse.status === HttpStatus.OK) {
					console.log('Successfully added club: ', club)
					return httpResponse.json();
				} else {
					console.error(`HTTP Error: ${httpResponse.status}:${httpResponse.statusText}`);
					return undefined;
				}
			})
			.then(addedClub => {
				console.log("added club to sever ", addedClub);
				if (addedClub) {
					this.addClubToLocalData(
						this.convertJsonClubToLocalClub(addedClub)
					);
				}
				this.isAddingClub = false;
			})
			.catch(error => {
				console.error(error);
				this.isAddingClub = false;
			});
	}

	addClubToLocalData = (club) => {
		const newClubs = [...this.state.clubs];
		newClubs.push(club);
		this.setState({clubs: newClubs});
	}

	updateClub = async (id, newClubProperties) => {
		if (this.canSendUpdateRequest()) {
			await this.updateClubOnServer(id, newClubProperties);
		}
		else {
			if (this.updateClubTimeoutId) {
				clearTimeout(this.updateClubTimeoutId);
			}

			this.updateClubTimeoutId = setTimeout(async () => {
				await this.updateClubOnServer(id, newClubProperties);
			}, REQUEST_COOLDOWN_DURATION)
		}
	}

	updateClubOnServer = async (id, newClubProperties) => {
		const club = this.state.clubs.find(club => club.id === id);

		if (!club) {
			console.log('Could not find club with id ', id);
		};

		let updatedClub = {...club}
		for (const propertyName in newClubProperties) {
			const propertValue = newClubProperties[propertyName];
			updatedClub[propertyName] = propertValue;
		}

		const requestInfo = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(
				this.convertLocalClubToJsonClub(updatedClub)
			)
		};

		this.updateLastRequestTime();

		try {
			const httpResponse = await fetch(CLUB_API_URL(updatedClub.id), requestInfo)
			console.log(httpResponse);

			if (httpResponse.status === HttpStatus.OK) {
				const updatedClub = await httpResponse.json();
				this.updateClubLocally(
					updatedClub.id,
					this.convertJsonClubToLocalClub(updatedClub)
				);
			}
			else {
				console.error(`HTTP Error: ${httpResponse.status}:${httpResponse.statusText}`);
			}
		}
		catch (error) {
			console.error(error);
		}
	}

	updateClubLocally = (id, updatedClub) => {
		const club = this.state.clubs.find(club => club.id === id);

		if (!club) {
			console.log('Could not find club with id ', id);
		};

		let newClubs = [...this.state.clubs];
		newClubs.forEach(club => {
			if (club.id === id) {
				for (const propertyName in updatedClub) {
					const propertyValue = updatedClub[propertyName];
					club[propertyName] = propertyValue;
				}
			}
		})

		this.setState({clubs: newClubs});
	}

  render() {
		return (
			<Container>
				<h1 className="my-4 text-center">Club Manager</h1>
				<Container className='mb-4 d-flex justify-content-center align-items-center'>
					<Row>
						<Col>
							<InputGroup>
								<UncontrolledButtonDropdown>
									<DropdownToggle caret>
										Filter By Location
									</DropdownToggle>
									<DropdownMenu>
										{this.state.clubs.map(club =>
											<DropdownItem
												key={club.id}
												onClick={() => {this.setState({locationFilter: club.location})}}
											>
												{club.location}
											</DropdownItem>
										)}
									</DropdownMenu>
								</UncontrolledButtonDropdown>
								<Input
									value={this.state.locationFilter}
									onChange={(event) => this.setState({locationFilter: event.target.value})}
									placeholder="Enter Location"
								/>
							</InputGroup>
						</Col>
					</Row>
				</Container>
				<Container className='mb-4 d-flex justify-content-center align-items-center'>
					<Button
						color="primary"
						onClick={() => this.setState({isCreatingClub: true})}
					>
						<FaPlus/> Add Club
					</Button>
				</Container>
				<Container fluid>
					<Row>
						{this.isFetchingClub ?
							<p className='text-center'>Fetching Clubs...</p>
						: this.state.clubs.length <= 0 ?
							<p className='text-center'>There's no clubs! Try adding one</p>
						:
							this.state.clubs
								.filter(club =>
									{
										if (!this.state.locationFilter) return true;

										return club.location.toLowerCase().includes(
											this.state.locationFilter.toLowerCase()
										)
									}
								)
								.sort((club1, club2) => club1.id - club2.id)
								.map(club =>
									<Col key={club.id} lg={4} md={6} sm={12} xs={12} className="mb-4">
										<Club
											club={club}
											updateClub={this.updateClub}
											deleteClub={this.deleteClub}
										/>
									</Col>
								)
						}
						{
							this.isAddingClub ?
								<Col lg={4} md={6} sm={12} xs={12} className="mb-4">
									<p className='text-center'>Adding Club...</p>
								</Col>
							:
								""
						}
					</Row>
				</Container>
				<ClubModal
					actionPerforming="Creating"
					club={this.possibleNewClub}
					isOpen={this.state.isCreatingClub}
					toggleOff={() => {this.setState({isCreatingClub: false})}}
					name={this.possibleNewClub.name}
					setName={(name) => {
						this.possibleNewClub = {...this.possibleNewClub, name: name}
					}}
					location={this.possibleNewClub.location}
					setLocation={(location) => {
						this.possibleNewClub = {...this.possibleNewClub, location: location}
					}}
					musicGenre={this.possibleNewClub.musicGenre}
					setMusicGenre={(musicGenre) => {
						this.possibleNewClub = {...this.possibleNewClub, musicGenre: musicGenre}
					}}
					yellowThreshold={this.possibleNewClub.yellowThreshold}
					setYellowThreshold={(yellowThreshold) => {
						this.possibleNewClub = {...this.possibleNewClub, yellowThreshold: yellowThreshold}
					}}
					maxCapacity={this.possibleNewClub.maxCapacity}
					setMaxCapacity={(maxCapacity) => {
						this.possibleNewClub = {...this.possibleNewClub, maxCapacity: maxCapacity}
					}}
					confirmButtonText="Create Club"
					onConfirm={this.createNewClub}
				/>
			</Container>
		);
	}
}