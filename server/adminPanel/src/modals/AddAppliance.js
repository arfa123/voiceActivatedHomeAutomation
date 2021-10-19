import React, { useContext, useState, useEffect } from "react";
import {
	Modal,
	Button,
	Form,
	Spinner
} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { GlobalContext } from "../context/GlobalState";
import { addAppliance, getRooms, getCategories } from "../api";

const AddAppliance = (props) => {

	const [rooms, setRooms] = useState([]);
	const [categories, setCategories] = useState([]);
	const [number, setNumber] = useState();
	const [pinNumber, setPinNumber] = useState();
	const [room, setRoom] = useState("");
	const [category, setCategory] = useState("");
	const [loading, setLoading] = useState(false);
	const history = useHistory();
	const { globalState } = useContext(GlobalContext);

	useEffect(() => {

		const getRoomsList = async () => {
			if (globalState.token) {
				const res = await getRooms(globalState.token);
				if (res && res.data && Array.isArray(res.data) && res.data.length) {
					setRooms(res.data);
				}
			} else {
				history.push("/");
			}
		};

		const getCategoriesList = async () => {
			if (globalState.token) {
				const res = await getCategories(globalState.token);
				if (res && res.data && Array.isArray(res.data) && res.data.length) {
					setCategories(res.data);
				}
			} else {
				history.push("/");
			}
		};

		getCategoriesList();
		getRoomsList();
	}, []);

	const onAddAppliance = async () => {
		const { setError, onHide } = props;
		const errors = [];
		if (!number) errors.push("Please Enter Appliance Number");
		if (!pinNumber) errors.push("Please Enter Appliance Pin Number");
		if (!room) errors.push("Please Select Appliance Room");
		if (!category) errors.push("Please Select Appliance Category");

		if (errors.length > 0) {
			setError(errors[0]);
			return;
		}

		if (globalState.token) {
			setLoading(true);
			const payload = {
				pin_number: pinNumber,
				number, room, category,
			};
			const res = await addAppliance(globalState.token, payload);

			setLoading(false);

			if (res.data) {
				onHide();
			} else if (res.error) {
				setError(res.error);
			} else {
				props.setError("Failed to add appliance");
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
					Add New Appliance
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group className="mb-3" controlId="formApplianceRoom">
    					<Form.Label>Appliance Room</Form.Label>
						<Form.Select aria-label="select room" onChange={(e) => setRoom(e.target.value)} value={room}>
							<option>Select Room</option>
							{rooms.map(roomItem => {
								return <option value={roomItem.room_name}>{roomItem.room_name}</option>;
							})}
						</Form.Select>
					</Form.Group>
					<Form.Group className="mb-3" controlId="formApplianceCategory">
    					<Form.Label>Appliance Category</Form.Label>
						<Form.Select aria-label="select category" onChange={(e) => setCategory(e.target.value)} value={category}>
							<option>Select Category</option>
							{categories.map(categoryItem => {
								return <option value={categoryItem.category_name}>{categoryItem.category_name}</option>;
							})}
						</Form.Select>
					</Form.Group>
					<Form.Group className="mb-3" controlId="formApplianceNumber">
						<Form.Control required type="number" placeholder="Enter Appliance Number" onChange={(e) => setNumber(e.target.value)} value={number} />
					</Form.Group>
					<Form.Group className="mb-3" controlId="formAppliancePin">
						<Form.Control required type="number" placeholder="Enter Appliance Pin Number" onChange={(e) => setPinNumber(e.target.value)} value={pinNumber} />
					</Form.Group>
					<Button variant="primary" type="button" onClick={onAddAppliance} disabled={loading}>
						{loading &&
							<Spinner
								as="span"
								animation="border"
								size="sm"
								role="status"
								aria-hidden="true"
							/>
						}
						Add Appliance
					</Button>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={props.onHide}>Close</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default AddAppliance;