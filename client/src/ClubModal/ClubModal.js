import React from 'react';
import { Button, Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';

export default class ClubModal extends React.Component {
	get club() {
		return this.props.club;
	}

	render = () => {
		return (
			<Modal
					isOpen={this.props.isOpen}
					toggle={this.props.toggleOff}
				>
					<ModalHeader> {this.props.actionPerforming} {this.club.name === '' ? 'a Club' : this.club.name}... </ModalHeader>
					<ModalBody>
						<Form>
							<Row>
								<Col md="6">
									<FormGroup>
										<Label> Name </Label>
										<Input
											value={this.props.name}
											onChange={(event) => this.props.setName(event.target.value)}
											placeholder="Enter club name"
										></Input>
									</FormGroup>
								</Col>
								<Col md="6">
									<FormGroup>
										<Label> Location </Label>
										<Input
											value={this.props.location}
											onChange={(event) => this.props.setLocation(event.target.value)}
											placeholder="Enter club location"
										></Input>
									</FormGroup>
								</Col>
								<Col md="6">
									<FormGroup>
										<Label> Music Genre </Label>
										<Input
											value={this.props.musicGenre}
											onChange={(event) => this.props.setMusicGenre(event.target.value)}
											placeholder="Enter club's music genre"
										></Input>
									</FormGroup>
								</Col>
								<Col md="6">
									<FormGroup>
										<Label> Capacity Warning Threshold </Label>
										<Input
											type='number'
											value={this.props.yellowThreshold}
											onChange={(event) => this.props.setYellowThreshold(event.target.value)}
										></Input>
									</FormGroup>
								</Col>
								<Col md="6">
									<FormGroup>
										<Label> Maximum Capacity </Label>
										<Input
											type='number'
											value={this.props.maxCapacity}
											onChange={(event) => this.props.setMaxCapacity(event.target.value)}
										></Input>
									</FormGroup>
								</Col>
							</Row>
						</Form>
					</ModalBody>
					<ModalFooter>
						<Button
							color="secondary"
							outline
							onClick={() => {
								this.props.toggleOff();
								if (this.props.onCancel) {
									this.props.onCancel()
								}
							}}>
							Cancel
						</Button>
						<Button
							color="primary"
							onClick={() => {
								this.props.toggleOff();
								if (this.props.onConfirm) {
									this.props.onConfirm();
								}
							}}>
							{this.props.confirmButtonText}
						</Button>
        </ModalFooter>
			</Modal>
		);
	}
}