const BASE_URL = "http://localhost:3000";

export const loginUser = async (data) => {
	const reqObj = {
		method: "POST",
		body: JSON.stringify(data)
	};

	try {
		return await callApi(reqObj, "/api/login");

	} catch (e) {
		console.log("login api failed: ", e);
		return {};
	}
};

export const getAppliances = async (token) => {
	const reqObj = {
		method: "GET"
	};

	try {
		return await callApi(reqObj, "/api/appliances", token);

	} catch (e) {
		console.log("getAppliances api failed: ", e);
		return {};
	}
};

export const addAppliance = async (token, data) => {
	const reqObj = {
		method: "POST",
		body: JSON.stringify(data)
	};

	try {
		return await callApi(reqObj, "/api/appliances", token);

	} catch (e) {
		console.log("addAppliance api failed: ", e);
		return {};
	}
};

export const getUsers = async (token) => {
	const reqObj = {
		method: "GET"
	};

	try {
		return await callApi(reqObj, "/api/users", token);

	} catch (e) {
		console.log("get users api failed: ", e);
		return {};
	}
};

export const addUser = async (token, data) => {
	const reqObj = {
		method: "POST",
		body: JSON.stringify(data)
	};

	try {
		return await callApi(reqObj, "/api/users", token);

	} catch (e) {
		console.log("add user api failed: ", e);
		return {};
	}
};

export const getCategories = async (token) => {
	const reqObj = {
		method: "GET"
	};

	try {
		return await callApi(reqObj, "/api/categories", token);

	} catch (e) {
		console.log("get categories api failed: ", e);
		return {};
	}
};

export const addCategory = async (token, data) => {
	const reqObj = {
		method: "POST",
		body: JSON.stringify(data)
	};

	try {
		return await callApi(reqObj, "/api/categories", token);

	} catch (e) {
		console.log("add category api failed: ", e);
		return {};
	}
};

export const getRooms = async (token) => {
	const reqObj = {
		method: "GET"
	};

	try {
		return await callApi(reqObj, "/api/rooms", token);

	} catch (e) {
		console.log("get rooms api failed: ", e);
		return {};
	}
};

export const addRoom = async (token, data) => {
	const reqObj = {
		method: "POST",
		body: JSON.stringify(data)
	};

	try {
		return await callApi(reqObj, "/api/rooms", token);

	} catch (e) {
		console.log("add room api failed: ", e);
		return {};
	}
};

function callApi(reqObj, path, token) {
	return new Promise(async (resolve, reject) => {
		let url = `${BASE_URL}${path}`;

		const payload = {
			...reqObj,
			headers: {
				'Content-Type': 'application/json'
			}
		};

		if (token) {
			payload.headers = {
				...payload.headers,
				'x-access-token': token
			};
		}

		try {
			const res = await fetch(url, payload);
			const response = await res.json();

			resolve(response);
		} catch (e) {
			console.log("Calling Api failed: ", e, url);

			reject(e);
		}
	});
}