import React, { useContext, useState } from "react";
import {
	Modal,
	Button,
	Form,
	Spinner
} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { GlobalContext } from "../context/GlobalState";
import { addCategory } from "../api";

const AddCategory = (props) => {

	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);
	const history = useHistory();
	const { globalState } = useContext(GlobalContext);

	const onAddCategory = async () => {
		const errors = [];
		if (!name) errors.push("Please Enter Name");

		if (errors.length > 0) return;

		if (globalState.token) {
			setLoading(true);
			const payload = { category_name: name };
			const res = await addCategory(globalState.token, payload);

			setLoading(false);
			if (res.data) {

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
					Add New Category
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group className="mb-3" controlId="formBasicName">
						<Form.Control required type="name" placeholder="Enter Category Name" onChange={(e) => setName(e.target.value)} value={name} />
					</Form.Group>
					<Button variant="primary" type="submit" onClick={onAddCategory} disabled={loading}>
						{loading &&
							<Spinner
								as="span"
								animation="border"
								size="sm"
								role="status"
								aria-hidden="true"
							/>
						}
						Add Category
					</Button>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={props.onHide}>Close</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default AddCategory;