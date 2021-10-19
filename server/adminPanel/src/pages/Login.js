import React, { useState, useContext } from "react";
import {
	Container,
	Row,
	Col,
	Form,
	Button,
	Spinner
} from 'react-bootstrap';
import { useHistory } from "react-router-dom";
import { loginUser } from "../api";
import { GlobalContext } from "../context/GlobalState";
import ErrorMessage from "../modals/ErrorMessage";

const Login = () => {

	const [ email, setEmail ] = useState("admin@abc.com");
	const [ password, setPassword ] = useState("admin123");
	const [ loading, setLoading ] = useState(false);
	const [ error, setError ] = useState("");
	const history = useHistory();
	const { userLoggedIn } = useContext(GlobalContext);

	const onLogin = async () => {
		const errors = [];
		if (!email) errors.push("Please Enter Eamil");
		if (!password) errors.push("Please Enter Password");

		if (errors.length > 0) {
			setError(errors[0]);
			return;
		}
		
		setLoading(true);
		const payload = { email, password };
		const res = await loginUser(payload);

		if (res.error) {
			setError(res.error);
			setLoading(false);
			return;
		}

		if (res.data) {
			userLoggedIn(res.data);
			history.push("/home");
		}
	};

	return (
		<div style={{width: "100vw", height: "100vh", alignItems: "center", display: "flex"}}>
			<ErrorMessage
				message={error}
				show={error ? true : false}
				onClose={() => setError("")}
			/>
			<Container>
				<Row>
					<Col></Col>
					<Col>
						<h2 style={{textAlign: "center"}}>Login</h2>
						<Form>
							<Form.Group className="mb-3" controlId="formBasicEmail">
								<Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} value={email}/>
							</Form.Group>
							<Form.Group className="mb-3" controlId="formBasicPassword">
								<Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password}/>
							</Form.Group>
							<Row>
								<Col></Col>
								<Col>
									<Button variant="primary" type="button" onClick={onLogin} disabled={loading}>
										{loading &&
											<Spinner
												as="span"
												animation="border"
												size="sm"
												role="status"
												aria-hidden="true"
											/>
										}
										Login
									</Button>
								</Col>
								<Col></Col>
							</Row>
						</Form>
					</Col>
					<Col></Col>
				</Row>
			</Container>
		</div>
	);
};

export default Login;