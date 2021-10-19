import "package:flutter/foundation.dart";
import "package:flutter_app/models/userData.dart";

class AuthModel extends ChangeNotifier {
	bool isLogedIn = false;
	String serverUrl = "";
	UserData userData = UserData(userId: 0, userEmail: "", userRole: "", accessToken: "");

	void userLogedIn(UserData data, String _serverUrl) {
		userData = data;
		isLogedIn = true;
		serverUrl = _serverUrl;

		notifyListeners();
	}

	void userLogedOut() {
		userData = UserData(userId: 0, userEmail: "", userRole: "", accessToken: "");
		isLogedIn = false;

		notifyListeners();
	}
}