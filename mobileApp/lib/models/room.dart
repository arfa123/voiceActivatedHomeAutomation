class Room {
	final String name;
	
	Room({ required this.name });

	factory Room.fromJson(Map<String, dynamic> data) {

		// Map<String, dynamic> data = json['data'];

		return Room(
			name: data['room_name']
		);
  }
}