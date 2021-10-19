class Appliance {
	final int id;
	final String name;
	final int status;
	final String category;
	final int number;
	
	Appliance({ required this.id, required this.name, required this.status, required this.category, required this.number });

	factory Appliance.fromJson(Map<String, dynamic> data) {

		// Map<String, dynamic> data = json['data'];

		return Appliance(
			id: data['id'],
			name: '${data['category']} ${data['number']}',
			status: data['status'],
			category: data['category'],
			number: data['number'],
		);
  }
}