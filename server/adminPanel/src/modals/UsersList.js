import React, { useEffect, useContext, useState } from "react";
import {
	Modal,
	Button,
	Table
} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { GlobalContext } from "../context/GlobalState";
import { getUsers } from "../api";

const UsersList = (props) => {

	const [users, setUsers] = useState([]);
	const history = useHistory();
	const { globalState } = useContext(GlobalContext);

	useEffect(() => {

		const getUsersList = async () => {
			if (globalState.token) {
				const res = await getUsers(globalState.token);
				if (res && res.data && Array.isArray(res.data) && res.data.length) {
					setUsers(res.data);
				}
			} else {
				history.push("/");
			}
		};

		getUsersList();
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
					Users List
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Table responsive>
					<thead>
						<tr>
							<th>Name</th>
							<th>Email</th>
							<th>Role</th>
						</tr>
					</thead>
					<tbody>
						{users.map((user, index) => {
							return (
								<tr key={index}>
									<td>{user.name}</td>
									<td>{user.email}</td>
									<td>{user.role}</td>
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

export default UsersList;