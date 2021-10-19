import React, { useEffect, useContext, useState } from "react";
import {
	Modal,
	Button,
	Table
} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { GlobalContext } from "../context/GlobalState";
import { getCategories } from "../api";

const CategoriesList = (props) => {

	const [categories, setCategories] = useState([]);
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
					Categories List
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
						{categories.map((category, index) => {
							return (
								<tr key={index}>
									<td>{category.category_name}</td>
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