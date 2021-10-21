import React, { useEffect, useContext, useState } from "react";
import {
	Modal,
	Button,
	Table,
	Spinner
} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { GlobalContext } from "../context/GlobalState";
import { getRooms, deleteRoom } from "../api";

const RoomsList = (props) => {

	const [rooms, setRooms] = useState([]);
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

		getRoomsList();
	}, [history, globalState.token]);

	const onDeleteRoom = async (roomName) => {
		const { setError, onHide } = props;

		if (globalState.token) {
			if (roomName) {
				setLoading(true);
				const res = await deleteRoom(globalState.token, roomName);
				setLoading(false);
	
				if (res.data) {
					onHide();
				} else if (res.error) {
					setError(res.error);
				} else {
					setError("Failed to delete room");
				}
			} else {
				setError("Failed to delete room, Invalid room");
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
					Rooms List
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Table responsive>
					<thead>
						<tr>
							<th>Name</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{rooms.map((room, index) => {
							return (
								<tr key={index}>
									<td>{room.room_name}</td>
									<td>
										<Button variant="danger" size="sm" onClick={() => onDeleteRoom(room.room_name)}>
											{loading &&
												<Spinner
													as="span"
													animation="border"
													size="sm"
													role="status"
													aria-hidden="true"
												/>
											}
											Delete
										</Button>
									</td>
								</tr>
							);
						})}
					</tbody>
				</Table>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={props.onHide}>Close</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default RoomsList;