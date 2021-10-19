import React, { useEffect, useContext, useState } from "react";
import {
	Nav,
	Navbar,
	Table,
	Badge,
	NavDropdown
} from 'react-bootstrap';
import { useHistory } from "react-router-dom";
import { GlobalContext } from "../context/GlobalState";
import { getAppliances } from "../api";
import UsersList from "../modals/UsersList";
import AddUser from "../modals/AddUser";
import CategoriesList from "../modals/CategoriesList";
import AddCategory from "../modals/AddCategory";
import RoomsList from "../modals/RoomsList";
import AddRoom from "../modals/AddRoom";
import AddAppliance from "../modals/AddAppliance";
import ErrorMessage from "../modals/ErrorMessage";

const Home = () => {

	const [ appliances, setAppliances ] = useState([]);
	const [ error, setError ] = useState("");
	const [ usersListVisible, setUsersListVisible ] = useState(false);
	const [ addUserVisible, setAddUserVisible ] = useState(false);
	const [ categoriesListVisible, setCategoriesListVisible ] = useState(false);
	const [ addCategoryVisible, setAddCategoryVisible ] = useState(false);
	const [ roomsListVisible, setRoomsListVisible ] = useState(false);
	const [ addRoomVisible, setAddRoomVisible ] = useState(false);
	const [ addApplianceVisible, setAddApplianceVisible ] = useState(false);
	const history = useHistory();
	const { globalState } = useContext(GlobalContext);

	useEffect(() => {

		const getAppliancesList = async () => {
			if (globalState.token) {
				const res = await getAppliances(globalState.token);
				if (res && res.data && Array.isArray(res.data) && res.data.length) {
					setAppliances(res.data);
				}
			} else {
				history.push("/");
			}
		};

		getAppliancesList();
	}, []);

	return (
		<>
			<ErrorMessage
				message={error}
				show={error ? true : false}
				onClose={() => setError("")}
			/>
			{usersListVisible &&
				<UsersList
					show={usersListVisible}
					onHide={() => setUsersListVisible(false)}
				/>
			}
			{addUserVisible &&
				<AddUser
					show={addUserVisible}
					onHide={() => setAddUserVisible(false)}
					setError={setError}
				/>
			}
			{categoriesListVisible &&
				<CategoriesList
					show={categoriesListVisible}
					onHide={() => setCategoriesListVisible(false)}
				/>
			}
			{addCategoryVisible &&
				<AddCategory
					show={addCategoryVisible}
					onHide={() => setAddCategoryVisible(false)}
					setError={setError}
				/>
			}
			{roomsListVisible &&
				<RoomsList
					show={roomsListVisible}
					onHide={() => setRoomsListVisible(false)}
				/>
			}
			{addRoomVisible &&
				<AddRoom
					show={addRoomVisible}
					onHide={() => setAddRoomVisible(false)}
					setError={setError}
				/>
			}
			{addApplianceVisible &&
				<AddAppliance
					show={addApplianceVisible}
					onHide={() => setAddApplianceVisible(false)}
					setError={setError}
				/>
			}
			<Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
				<Navbar.Brand>Voice Activated Home Automation</Navbar.Brand>
				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav className="me-auto">
						<NavDropdown title="Users" id="collasible-nav-dropdown">
							<NavDropdown.Item onClick={() => setUsersListVisible(!usersListVisible)}>View Users</NavDropdown.Item>
							<NavDropdown.Item onClick={() => setAddUserVisible(!addUserVisible)}>Add User</NavDropdown.Item>
						</NavDropdown>
						<NavDropdown title="Categories" id="collasible-nav-dropdown">
							<NavDropdown.Item onClick={() => setCategoriesListVisible(!categoriesListVisible)}>View Categories</NavDropdown.Item>
							<NavDropdown.Item onClick={() => setAddCategoryVisible(!addCategoryVisible)}>Add Category</NavDropdown.Item>
						</NavDropdown>
						<NavDropdown title="Rooms" id="collasible-nav-dropdown">
							<NavDropdown.Item onClick={() => setRoomsListVisible(!roomsListVisible)}>View Rooms</NavDropdown.Item>
							<NavDropdown.Item onClick={() => setAddRoomVisible(!addRoomVisible)}>Add Room</NavDropdown.Item>
						</NavDropdown>
					</Nav>
					<Nav>
						<Nav.Link onClick={() => setAddApplianceVisible(!addApplianceVisible)}>Add Appliance</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
			<h3 style={{ textAlign: 'center' }}>
				<Badge bg="secondary">Appliances List</Badge>
			</h3>
			<Table responsive>
				<thead>
					<tr>
						<th>Id</th>
						<th>Name</th>
						<th>Category</th>
						<th>Number</th>
						<th>Room</th>
						<th>Pin Number</th>
						<th>Status</th>
					</tr>
				</thead>
				<tbody>
					{appliances.map((appliance, index) => {
						return (
							<tr key={index}>
								<td>{appliance.id}</td>
								<td>{`${appliance.category} ${appliance.number}`}</td>
								<td>{appliance.category}</td>
								<td>{appliance.number}</td>
								<td>{appliance.room}</td>
								<td>{appliance.pin_number}</td>
								<td>{appliance.status ? "ON" : "OFF"}</td>
							</tr>
						);
					})}
				</tbody>
			</Table>
		</>
	);
};

export default Home;