import React, { useEffect, useContext, useState } from "react";
import {
	Modal,
	Button,
	Table,
	Spinner
} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { GlobalContext } from "../context/GlobalState";
import { getCategories, deleteCategory } from "../api";

const CategoriesList = (props) => {

	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(false);
	const history = useHistory();
	const { globalState } = useContext(GlobalContext);

	useEffect(() => {

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
	}, [history, globalState.token]);

	const onDeleteCategory = async (categoryName) => {
		const { setError, onHide } = props;

		if (globalState.token) {
			if (categoryName) {
				setLoading(true);
				const res = await deleteCategory(globalState.token, categoryName);
				setLoading(false);

				if (res.data) {
					onHide();
				} else if (res.error) {
					setError(res.error);
				} else {
					setError("Failed to delete category");
				}
			} else {
				setError("Failed to delete category, Invalid category");
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
					Categories List
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
						{categories.map((category, index) => {
							return (
								<tr key={index}>
									<td>{category.category_name}</td>
									<td>
										<Button variant="danger" size="sm" onClick={() => onDeleteCategory(category.category_name)}>
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

export default CategoriesList;