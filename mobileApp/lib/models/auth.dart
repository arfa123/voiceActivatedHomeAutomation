import "package:flutter/foundation.dart";
import "package:flutter_app/models/userData.dart";

class AuthModel extends ChangeNotifier {
	bool isLogedIn = false;
	UserData userData = UserData(userId: 0, userEmail: "", userRole: "", accessToken: "");

	void userLogedIn(UserData data) {
		userData = data;
		isLogedIn = true;

		notifyListeners();
	}

	void userLogedOut() {
		userData = UserData(userId: 0, userEmail: "", userRole: "", accessToken: "");
		isLogedIn = false;

		notifyListeners();
	}
}