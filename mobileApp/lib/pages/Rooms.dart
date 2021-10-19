import "package:flutter/material.dart";
import "package:flutter_app/utils.dart";
import 'dart:async';
import "package:provider/provider.dart";
import "package:flutter_app/models/auth.dart";
import "package:flutter_app/models/room.dart";
import 'dart:convert' as convert;
import 'package:http/http.dart' as http;

class Rooms extends StatelessWidget {

	Future<List<Room>> fetchRooms(BuildContext context) async {
		final String accessToken = Provider.of<AuthModel>(context, listen: false).userData.accessToken;
		final String serverUrl = Provider.of<AuthModel>(context, listen: false).serverUrl;

		final response = await http.get(
			Uri.parse('http://$serverUrl:3000/api/rooms'),
			headers: {
				'x-access-token': accessToken,
			},
		);

		final responseJson = convert.jsonDecode(response.body);
		final data = responseJson['data'];

		return data.map<Room>((json) => Room.fromJson(json)).toList();
	}

	Widget build(BuildContext context) {
		return Scaffold(
			appBar: AppBar(
				title: Text("Voice Activated Home Automation"),
				centerTitle: true,
			),
			body: FutureBuilder<List<Room>>(
				future: fetchRooms(context),
				builder: (context, snapshot) {
					if (snapshot.hasError) {
						return const Center(
							child: Text('An error has occurred!'),
						);
					} else if (snapshot.hasData) {
						return ListView.builder(
							itemCount: snapshot.data!.length,
							itemBuilder: (context, index) {
								return Padding(
									padding: const EdgeInsets.symmetric(vertical: 20.0, horizontal: 20.0),
									child: ElevatedButton(
										style: ElevatedButton.styleFrom(
											padding: EdgeInsets.symmetric(horizontal: 16, vertical: 26)
										),
										onPressed: () {navigate(context, '/appliances', params: snapshot.data![index].name);},
										child: Text(snapshot.data![index].name, style: TextStyle(fontSize: 24.0))
									)
								);
							}
						);
					} else {
						return const Center(
							child: CircularProgressIndicator(),
						);
					}
				},
			),
		);
	}
}