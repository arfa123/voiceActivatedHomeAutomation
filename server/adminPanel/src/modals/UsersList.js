import React, { useEffect, useContext, useState } from "react";
import {
	Modal,
	Button,
	Table,
	Spinner
} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { GlobalContext } from "../context/GlobalState";
import { getUsers, deleteUser } from "../api";

const UsersList = (props) => {

	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
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
	}, [history, globalState.token]);

	const onDeleteUser = async (userId) => {
		const { setError, onHide } = props;

		if (globalState.token) {
			if (userId) {
				setLoading(true);
				const res = await deleteUser(globalState.token, userId);
				setLoading(false);
	
				if (res.data) {
					onHide();
				} else if (res.error) {
					setError(res.error);
				} else {
					setError("Failed to delete user");
				}
			} else {
				setError("Failed to delete user, Invalid user");
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
					Users List
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Table responsive>
					<thead>
						<tr>
							<th>ID</th>
							<th>Name</th>
							<th>Email</th>
							<th>Role</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{users.map((user, index) => {
							return (
								<tr key={index}>
									<td>{user.id}</td>
									<td>{user.name}</td>
									<td>{user.email}</td>
									<td>{user.role}</td>
									<td>
										{user.role === "user" &&
											<Button variant="danger" size="sm" onClick={() => onDeleteUser(user.id)}>
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
										}
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

export default UsersList;