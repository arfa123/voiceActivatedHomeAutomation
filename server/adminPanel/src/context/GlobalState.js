import React, { createContext, useReducer } from "react";

// Initial State
const initialState = {
	isLoggedIn: false,
	email: "",
	name: "",
	role: "",
	token: ""
};

function AppReducer(state, action) {
	switch (action.type) {
		case "LOGGED_IN":
			return {
				...state,
				isLoggedIn: true,
				...action.payload
			};
		case "LOGGED_OUT":
			return {
				...initialState
			};
		default:
			return state;
	}
}

// Create context
export const GlobalContext = createContext(initialState);

// Provider component
export const GlobalProvider = ({ children }) => {
	const [state, dispatch] = useReducer(AppReducer, initialState);

	function userLoggedIn(payload) {
		dispatch({
			type: "LOGGED_IN",
			payload
		});
	}

	function userLoggedOut() {
		dispatch({
			type: "ADD_TRANSACTION"
		});
	}

	return (
		<GlobalContext.Provider value={{
			globalState: state,
			userLoggedIn,
			userLoggedOut
		}}>
			{children}
		</GlobalContext.Provider>
	);
};