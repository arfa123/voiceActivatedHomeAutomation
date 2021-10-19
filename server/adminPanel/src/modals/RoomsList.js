import React, { useEffect, useContext, useState } from "react";
import {
	Modal,
	Button,
	Table
} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { GlobalContext } from "../context/GlobalState";
import { getRooms } from "../api";

const RoomsList = (props) => {

	const [rooms, setRooms] = useState([]);
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
	}, []);

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
						</tr>
					</thead>
					<tbody>
						{rooms.map((room, index) => {
							return (
								<tr key={index}>
									<td>{room.room_name}</td>
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