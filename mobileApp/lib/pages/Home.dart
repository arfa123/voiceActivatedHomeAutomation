import "package:flutter/material.dart";
import "package:flutter_app/utils.dart";

class Home extends StatelessWidget {
	Widget build(BuildContext context) {
		return Scaffold(
			appBar: AppBar(
				title: Text("Voice Activated Home Automation"),
				centerTitle: true,
			),
			body: ListView(
				children: [
					Padding(
						padding: const EdgeInsets.symmetric(vertical: 20.0, horizontal: 20.0),
						child: ElevatedButton(
							style: ElevatedButton.styleFrom(
								padding: EdgeInsets.symmetric(horizontal: 16, vertical: 26)
							),
							onPressed: () {navigate(context, '/appliances');},
							child: const Text("View Appliances", style: TextStyle(fontSize: 24.0))
						)
					),
					Padding(
						padding: const EdgeInsets.symmetric(vertical: 20.0, horizontal: 20.0),
						child: ElevatedButton(
							style: ElevatedButton.styleFrom(
								padding: EdgeInsets.symmetric(horizontal: 16, vertical: 26)
							),
							onPressed: () {navigate(context, '/voice_command');},
							child: const Text("Voice Command", style: TextStyle(fontSize: 24.0))
						)
					)
				],
			)
		);
	}
}