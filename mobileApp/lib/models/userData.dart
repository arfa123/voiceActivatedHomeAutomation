class UserData {
	final int userId;
	final String userEmail;
	final String userRole;
	final String accessToken;
	
	UserData({ required this.userId, required this.userEmail, required this.userRole, required this.accessToken});

	factory UserData.fromJson(Map<String, dynamic> json) {

		Map<String, dynamic> data = json['data'];

		return UserData(
			userId: data['id'],
			userEmail: data['email'],
			userRole: data['role'],
			accessToken: data['token'],
		);
  }
}