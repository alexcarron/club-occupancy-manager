import React from 'react';
import './Club.css';
import {Button, Card, CardBody, CardTitle, Col, Modal, ModalFooter, ModalHeader, Row, UncontrolledTooltip} from 'reactstrap'
import { FaMinus, FaPlus } from 'react-icons/fa';
import { MdDeleteOutline, MdEdit } from 'react-icons/md';
import ClubModal from '../ClubModal/ClubModal';

const OccupancyLevel = {
	Normal: 0,
	Caution: 1,
	MaxCapacity: 2,
}

export default class Club extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isEditModalOpen: false,
			isEditing: false,
			isDeleteModalOpen: false,
			isDeleting: false,
			isEditingOccupancy: false,
			name: this.club.name,
			location: this.club.location,
			musicGenre: this.club.musicGenre,
			yellowThreshold: this.club.yellowThreshold,
			maxCapacity: this.club.maxCapacity,
		};
	}

	get isDeleteModalOpen() {return this.state.isDeleteModalOpen}
	set isDeleteModalOpen(isDeleteModalOpen) {
		this.setState({isDeleteModalOpen: isDeleteModalOpen})
	}

	get isDeleting() {return this.state.isDeleting}
	set isDeleting(isDeleting) {
		this.setState({isDeleting: isDeleting})
	}

	get isEditing() {return this.state.isEditing}
	set isEditing(isEditing) {
		this.setState({isEditing: isEditing})
	}

	get isEditingOccupancy() {return this.state.isEditingOccupancy}
	set isEditingOccupancy(isEditingOccupancy) {
		this.setState({isEditingOccupancy: isEditingOccupancy})
	}

	onConfirmUpdate = async () => {
		this.isEditing = true;
		await this.props.updateClub(this.club.id,
			{
				'name': this.state.name,
				'location': this.state.location,
				'musicGenre': this.state.musicGenre,
				'yellowThreshold': this.state.yellowThreshold,
				'maxCapacity': this.state.maxCapacity,
			}
		);
		this.isEditing = false;
	}

	resetPossibleNewProperties = () => {
		this.setState({
			name: this.club.name,
			location: this.club.location,
			musicGenre: this.club.musicGenre,
			yellowThreshold: this.club.yellowThreshold,
			maxCapacity: this.club.maxCapacity,
		})
	}

	setName = (name) => {
		this.setState({name: name});
	}

	setLocation = (location) => {
		this.setState({location: location});
	}

	setMusicGenre = (musicGenre) => {
		this.setState({musicGenre: musicGenre})
	}

	setYellowThreshold = (yellowThreshold) => {
		this.setState({yellowThreshold: yellowThreshold})
	}

	setMaxCapacity = (maxCapacity) => {
		this.setState({maxCapacity: maxCapacity})
	}

	increment = async () => {
		this.isEditingOccupancy = true;
		const newOccupancy = this.club.occupancy + 1;
		await this.props.updateClub(this.club.id,
			{'occupancy': newOccupancy}
		)
		this.isEditingOccupancy = false;
	}

	decrement = async () => {
		this.isEditingOccupancy = true;
		const newOccupancy = this.club.occupancy - 1;
		await this.props.updateClub(this.club.id,
			{'occupancy': newOccupancy}
		)
		this.isEditingOccupancy = false;
	}

	canIncrement = () => {
		return (this.club.occupancy + 1) <= this.club.maxCapacity
	}

	canDecrement = () => {
		return (this.club.occupancy - 1) >= 0;
	}

	get club() {
		return this.props.club;
	}

	getOccupancyLevel = () => {
		const {yellowThreshold, maxCapacity} = this.props.club;

		if (this.props.club.occupancy < yellowThreshold) {
			return OccupancyLevel.Normal;
		} else if (this.props.club.occupancy < maxCapacity) {
			return OccupancyLevel.Caution;
		} else {
			return OccupancyLevel.MaxCapacity;
		}
	}

	getBackgroundColor = () => {
		const occupancyLevelToColor = {
			[OccupancyLevel.Normal]: '#e0fce3',
			[OccupancyLevel.Caution]: '#eef0c6',
			[OccupancyLevel.MaxCapacity]: '#eaa9a9',
		}

		const level = this.getOccupancyLevel();
		return occupancyLevelToColor[level];
	}

	getDisplayMessage = () => {
		const occupancyLevelToMessage = {
			[OccupancyLevel.Normal]: 'Welcome!',
			[OccupancyLevel.Caution]: 'Warn the bouncers...',
			[OccupancyLevel.MaxCapacity]: 'No one allowed in!',
		}

		const level = this.getOccupancyLevel();
		return occupancyLevelToMessage[level];
	}

	openEditingModal = () => {
		this.setState({isEditModalOpen: true});
	}

	closeEditingModal = () => {
		this.setState({isEditModalOpen: false});
	}

	render = () => {
		return (
			<>
				<Card
					style={{ backgroundColor: this.getBackgroundColor() }}
				>
					<CardBody>
						<CardTitle
							tag="h5"
						>
							<Row
							className='flex justify-content-between'>
								<Col className='mb-2' xs>
									{this.isDeleting ? "Deleting Club..." : this.isEditing ? "Editing Club..." : this.club.name}
								</Col>
								<Col className="d-flex gap-1" xs="auto">
									<Button
										id={"clubEditButton" + this.club.id}
										color="secondary"
										outline
										onClick={this.openEditingModal}
										style={{aspectRatio: 1}}
									>
										<MdEdit size="20"/>
									</Button>
									<UncontrolledTooltip
										placement="top"
										target={"clubEditButton" + this.club.id}
										timeout="10"
									>
										Edit {this.club.name}
									</UncontrolledTooltip>

									<Button
										id={"clubDeleteButton" + this.club.id}
										color="danger"
										onClick={() => {this.isDeleteModalOpen = true}}
									>
										<MdDeleteOutline  size="24"/>
									</Button>
									<UncontrolledTooltip
										placement="top"
										target={"clubDeleteButton" + this.club.id}
										timeout="10"
									>
										Delete {this.club.name}
									</UncontrolledTooltip>
								</Col>
							</Row>
						</CardTitle>
						<p className="mb-0">
							<strong>Location: </strong>
							{this.club.location}
						</p>
						<p className="mb-0">
							<strong>Genre: </strong>
							{this.club.musicGenre}
						</p>
						<p className="mb-2">
							<strong>Occupancy: </strong>
							{this.isEditingOccupancy ? "Updating..." : this.club.occupancy}
						</p>
						<div className="d-flex align-items-center justify-content-between">
							<Button
								color="success"
								outline
								disabled={!this.canIncrement()}
								onClick={this.increment}
							>
								<FaPlus></FaPlus>
							</Button>
							<Button
								color="danger"
								outline
								disabled={!this.canDecrement()}
								onClick={this.decrement}
							>
								<FaMinus></FaMinus>
							</Button>
						</div>
					</CardBody>
				</Card>
				<ClubModal
					actionPerforming="Editing"
					club={this.club}
					isOpen={this.state.isEditModalOpen}
					toggleOff={this.closeEditingModal}
					name={this.state.name}
					setName={this.setName}
					location={this.state.location}
					setLocation={this.setLocation}
					musicGenre={this.state.musicGenre}
					setMusicGenre={this.setMusicGenre}
					yellowThreshold={this.state.yellowThreshold}
					setYellowThreshold={this.setYellowThreshold}
					maxCapacity={this.state.maxCapacity}
					setMaxCapacity={this.setMaxCapacity}
					confirmButtonText="Confirm Edits"
					onConfirm={this.onConfirmUpdate}
					onCancel={this.resetPossibleNewProperties}
				/>
				<Modal
					isOpen={this.isDeleteModalOpen}
					toggle={() => {this.isDeleteModalOpen = !this.isDeleteModalOpen}}
				>
					<ModalHeader>Do you want to delete "{this.club.name}"?</ModalHeader>
					<ModalFooter>
						<Button
							color="secondary"
							onClick={() => {this.isDeleteModalOpen = false}}
							outline
						>
							Go Back
						</Button>
						<Button
							color="danger"
							onClick={async () => {
								this.isDeleteModalOpen = false;
								this.isDeleting = true;
								await this.props.deleteClub(this.club.id)
								this.isDeleting = false;
							}}
						>
							Delete
						</Button>
					</ModalFooter>
				</Modal>
			</>
		);
	}
}