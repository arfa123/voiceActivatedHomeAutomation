import "package:flutter/material.dart";
import "package:provider/provider.dart";
import "package:flutter_app/pages/Login.dart";
import "package:flutter_app/pages/Home.dart";
import "package:flutter_app/pages/Appliances.dart";
import "package:flutter_app/pages/VoiceCommand.dart";
import "package:flutter_app/models/auth.dart";
import 'package:flutter_easyloading/flutter_easyloading.dart';

class App extends StatelessWidget {

	Widget build(BuildContext context) {
		return MultiProvider(
			providers: [
				ChangeNotifierProvider<AuthModel>(create: (context) => AuthModel())
			],
			child: MaterialApp(
				initialRoute: "/login",
				routes: {
					"/login": (context) => Login(),
					"/home": (context) => Home(),
					"/appliances": (context) => Appliances(),
					"/voice_command": (context) => VoiceCommand()
				},
				builder: EasyLoading.init(),
			),
		);
	}
}