import React, { useContext, useState } from "react";
import {
	Modal,
	Button,
	Form,
	Spinner
} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { GlobalContext } from "../context/GlobalState";
import { addRoom } from "../api";

const AddRoom = (props) => {

	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);
	const history = useHistory();
	const { globalState } = useContext(GlobalContext);

	const onAddRoom = async () => {
		const { setError, onHide } = props;
		const errors = [];
		if (!name) errors.push("Please Enter Name");

		if (errors.length > 0) {
			setError(errors[0]);
			return;
		}

		if (globalState.token) {
			setLoading(true);
			const payload = { room_name: name };
			const res = await addRoom(globalState.token, payload);

			setLoading(false);
			
			if (res.data) {
				onHide();
			} else if (res.error) {
				setError(res.error);
			} else {
				props.setError("Failed to add room");
			}
		} else {
			history.push("/");
		}
	};

	return (
		<Modal
			{...props}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					Add New Room
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group className="mb-3" controlId="formBasicName">
						<Form.Control required type="name" placeholder="Enter Room Name" onChange={(e) => setName(e.target.value)} value={name} />
					</Form.Group>
					<Button variant="primary" type="submit" onClick={onAddRoom} disabled={loading}>
						{loading &&
							<Spinner
								as="span"
								animation="border"
								size="sm"
								role="status"
								aria-hidden="true"
							/>
						}
						Add Room
					</Button>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={props.onHide}>Close</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default AddRoom;