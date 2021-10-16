class Appliance {
	final int id;
	final String name;
	final int status;
	final String category;
	
	Appliance({ required this.id, required this.name, required this.status, required this.category});

	factory Appliance.fromJson(Map<String, dynamic> data) {

		// Map<String, dynamic> data = json['data'];

		return Appliance(
			id: data['id'],
			name: data['name'],
			status: data['status'],
			category: data['category'],
		);
  }
}