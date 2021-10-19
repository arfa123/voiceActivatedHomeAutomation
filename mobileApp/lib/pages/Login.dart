import "package:flutter/material.dart";
import "package:flutter/services.dart";
import "package:provider/provider.dart";
import "package:flutter_app/utils.dart";
import "package:flutter_app/models/auth.dart";
import "package:flutter_app/models/userData.dart";
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'dart:convert' as convert;
import 'package:http/http.dart' as http;

class Login extends StatefulWidget {
	LoginState createState() => LoginState();
}

class LoginState extends State<Login> {
	TextEditingController serverUrlCtrl = TextEditingController();
	TextEditingController emailCtrl = TextEditingController();
	TextEditingController passwordCtrl = TextEditingController();
	final GlobalKey<FormState> _loginFormKey = GlobalKey<FormState>();

	signinUser(context) async {
		String serverUrl = serverUrlCtrl.text;
		String email = emailCtrl.text;
		String password = passwordCtrl.text;
		String role = "user";

		Map payload = {
			"email": email,
			"password": password,
			"role": role
		};

		try{
			EasyLoading.show(status: "Loading...");
			var url = Uri.parse('http://$serverUrl:3000/api/login');
			var response = await http.post(url, body: payload);
			print('Response status: ${response.statusCode} ${response.statusCode == 200}');
			print('Response body: ${response.body}');

			if (response.statusCode == 200) {
				UserData userData = UserData.fromJson(convert.jsonDecode(response.body));
				Provider.of<AuthModel>(context, listen: false).userLogedIn(userData, serverUrl);
				navigateClearStack(context, "/home");
			}
			EasyLoading.dismiss();

		} on PlatformException catch (error)  {
			EasyLoading.dismiss();
			List<String> errors = error.toString().split(',');
			// showDialog(errors[1]);
		} catch(e) {
			EasyLoading.dismiss();
			print("Signin error: $e");
		}
	}

	Widget build(BuildContext context) {
		return Scaffold(
			appBar: AppBar(
				title: new Text("Voice Activated Home Automation"),
				centerTitle: true,
			),
			body: Form(
				key: _loginFormKey,
				child: Column(
					crossAxisAlignment: CrossAxisAlignment.center,
					children: [
						Padding(
							padding: const EdgeInsets.symmetric(horizontal: 20.0),
							child: TextFormField(
								controller: serverUrlCtrl,
								decoration: const InputDecoration(
									icon: Icon(Icons.link),
									labelText: 'Server Url',
								),
								// The validator receives the text that the user has entered.
								validator: (value) {
									if (value == null || value.isEmpty) {
										return 'Please Enter Server Url';
									}
									return null;
								},
							),
						),
						Padding(
							padding: const EdgeInsets.symmetric(horizontal: 20.0),
							child: TextFormField(
								controller: emailCtrl,
								decoration: const InputDecoration(
									icon: Icon(Icons.person),
									labelText: 'Email',
								),
								// The validator receives the text that the user has entered.
								validator: (value) {
									if (value == null || value.isEmpty) {
										return 'Please Enter Email';
									}
									return null;
								},
							),
						),
						Padding(
							padding: const EdgeInsets.symmetric(horizontal: 20.0),
							child: TextFormField(
								controller: passwordCtrl,
								decoration: const InputDecoration(
									icon: Icon(Icons.password),
									labelText: 'Password',
								),
								// The validator receives the text that the user has entered.
								validator: (value) {
									if (value == null || value.isEmpty) {
										return 'Please Enter Password';
									}
									return null;
								},
							),
						),
						Padding(
							padding: const EdgeInsets.symmetric(vertical: 16.0),
							child: ElevatedButton(
								onPressed: () {
									// Validate returns true if the form is valid, or false otherwise.
									if (_loginFormKey.currentState!.validate()) {
										signinUser(context);
									}
								},
								child: const Text('Login'),
							),
						),
					],
				),
			)
		);
	}
}