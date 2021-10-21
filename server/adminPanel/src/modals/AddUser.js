import React, { useContext, useState } from "react";
import {
	Modal,
	Button,
	Form,
	Spinner
} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { GlobalContext } from "../context/GlobalState";
import { addUser } from "../api";

const AddUser = (props) => {

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const history = useHistory();
	const { globalState } = useContext(GlobalContext);

	const onAddUser = async () => {
		const { setError, onHide } = props;
		const errors = [];
		if (!name) errors.push("Please Enter Name");
		if (!email) errors.push("Please Enter Eamil");
		if (!password) errors.push("Please Enter Password");

		if (errors.length > 0) {
			setError(errors[0]);
			return;
		}

		if (globalState.token) {
			setLoading(true);
			const payload = { name, email, password, role: "user" };
			const res = await addUser(globalState.token, payload);
	
			setLoading(false);

			if (res.data) {
				onHide();
			} else if (res.error) {
				setError(res.error);
			} else {
				setError("Failed to add user");
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
					Add New User
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group className="mb-3" controlId="formBasicName">
						<Form.Control required type="name" placeholder="Enter name" onChange={(e) => setName(e.target.value)} value={name} />
					</Form.Group>
					<Form.Group className="mb-3" controlId="formBasicEmail">
						<Form.Control required type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} value={email} />
					</Form.Group>
					<Form.Group className="mb-3" controlId="formBasicPassword">
						<Form.Control required type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password} />
					</Form.Group>
					<Button variant="primary" type="button" onClick={onAddUser} disabled={loading}>
						{loading &&
							<Spinner
								as="span"
								animation="border"
								size="sm"
								role="status"
								aria-hidden="true"
							/>
						}
						Add User
					</Button>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={props.onHide}>Close</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default AddUser;