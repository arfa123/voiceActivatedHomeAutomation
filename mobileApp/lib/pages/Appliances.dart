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

		final response = await http.get(
			Uri.parse('http://192.168.1.12:3000/api/appliances'),
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
								return Padding(
									padding: EdgeInsets.symmetric(horizontal: 16, vertical: 16),
									child: Text(snapshot.data![index].name)
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