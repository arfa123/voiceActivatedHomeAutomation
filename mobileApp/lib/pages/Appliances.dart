import "package:flutter/material.dart";
import 'dart:async';
import "package:provider/provider.dart";
import "package:flutter_app/models/auth.dart";
import "package:flutter_app/models/appliance.dart";
import 'dart:convert' as convert;
import 'package:http/http.dart' as http;

class Appliances extends StatelessWidget {

	Future<List<Appliance>> fetchAppliances(BuildContext context) async {
		final String accessToken = Provider.of<AuthModel>(context, listen: false).userData.accessToken;
		final String serverUrl = Provider.of<AuthModel>(context, listen: false).serverUrl;
		final dynamic roomName = ModalRoute.of(context)!.settings.arguments;

		final response = await http.get(
			Uri.parse('http://$serverUrl:3000/api/appliances?room_name=$roomName'),
			headers: {
				'x-access-token': accessToken,
			},
		);

		final responseJson = convert.jsonDecode(response.body);
		final data = responseJson['data'];

		return data.map<Appliance>((json) => Appliance.fromJson(json)).toList();
	}

	Widget build(BuildContext context) {
		return Scaffold(
			appBar: AppBar(
				title: Text("Voice Activated Home Automation"),
				centerTitle: true,
			),
			body: FutureBuilder<List<Appliance>>(
				future: fetchAppliances(context),
				builder: (context, snapshot) {
					if (snapshot.hasError) {
						return const Center(
							child: Text('An error has occurred!'),
						);
					} else if (snapshot.hasData) {
						return ListView.builder(
							itemCount: snapshot.data!.length,
							itemBuilder: (context, index) {
								return Container(
									padding: const EdgeInsets.all(20),
									child: Row(
										mainAxisAlignment: MainAxisAlignment.spaceEvenly,
										children: [
											Column(
												children: [
													snapshot.data![index].category == 'light'
														? Icon(Icons.lightbulb, color: Colors.green[500])
														: Icon(Icons.radio_button_checked, color: Colors.green[500])
												],
											),
											Column(
												children: [
													Text(snapshot.data![index].name),
												],
											),
											Column(
												children: [
													snapshot.data![index].status == 1
														? Icon(Icons.toggle_on, color: Colors.green[500])
														: Icon(Icons.toggle_off, color: Colors.red[500])
												],
											),
										],
									),
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