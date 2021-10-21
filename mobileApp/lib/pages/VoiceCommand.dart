import "package:flutter/material.dart";
import "package:flutter/services.dart";
import 'dart:math';
import 'dart:async';
import "package:provider/provider.dart";
import "package:flutter_app/models/auth.dart";
import 'dart:convert' as convert;
import 'package:http/http.dart' as http;

import 'package:speech_to_text/speech_recognition_error.dart';
import 'package:speech_to_text/speech_recognition_result.dart';
import 'package:speech_to_text/speech_to_text.dart';

class VoiceCommand extends StatefulWidget {
	VoiceCommandState createState() => VoiceCommandState();
}

class VoiceCommandState extends State<VoiceCommand> {
	bool _hasSpeech = false;
	double level = 0.0;
	double minSoundLevel = 50000;
	double maxSoundLevel = -50000;
	String lastWords = '';
	String lastError = '';
	String lastStatus = '';
	String _currentLocaleId = '';
	int resultListened = 0;
	List<LocaleName> _localeNames = [];
	final SpeechToText speech = SpeechToText();
	final GlobalKey<ScaffoldMessengerState> _scaffoldMessengerKey = GlobalKey<ScaffoldMessengerState>();

	@override
	void initState() {
		initSpeechState();
		super.initState();
	}

	showDialog(String message, { String type = "success" }) {
		final snackBar = SnackBar(
			content: Text(message, style: TextStyle(color: Colors.white)),
			backgroundColor: type == "error" ? Colors.red : Colors.green
		);
		_scaffoldMessengerKey.currentState!.showSnackBar(snackBar);
	}

	sendVoiceCommand(String recognizedWords) async {
		print('sendVoiceCommand: $recognizedWords');
		Map payload = {
			"command": recognizedWords
		};

		try{
			final String accessToken = Provider.of<AuthModel>(context, listen: false).userData.accessToken;
			final String serverUrl = Provider.of<AuthModel>(context, listen: false).serverUrl;
			var response = await http.post(
				Uri.parse('http://$serverUrl:3000/api/command'),
				headers: {
					'x-access-token': accessToken,
				},
				body: payload
			);
			print('Response status: ${response.statusCode}');
			print('Response body: ${response.body}');

			if (response.statusCode == 200) {
				showDialog('Specified action has been processed successfully');
			} else {
				final responseJson = convert.jsonDecode(response.body);
				final error = responseJson['error'];
				showDialog(error, type: "error");
			}

		} on PlatformException catch (error)  {
			List<String> errors = error.toString().split(',');
			showDialog(errors[1], type: "error");
		} catch(e) {
			print("sendVoiceCommand error: $e");
			showDialog(e.toString(), type: "error");
		}
	}

	Future<void> initSpeechState() async {
		var hasSpeech = await speech.initialize(
			onError: errorListener,
			onStatus: statusListener,
			debugLogging: true,
			finalTimeout: Duration(milliseconds: 0));
		if (hasSpeech) {
			_localeNames = await speech.locales();

			var systemLocale = await speech.systemLocale();
			_currentLocaleId = systemLocale?.localeId ?? '';
		}

		if (!mounted) return;

		setState(() {
			_hasSpeech = hasSpeech;
		});
	}

	Widget build(BuildContext context) {
		return ScaffoldMessenger(
			key: _scaffoldMessengerKey,
			child: Scaffold(
				appBar: AppBar(
					title: Text("Voice Activated Home Automation"),
					centerTitle: true,
				),
				body: Column(children: [
					Center(
						child: Text(
							'Speech recognition available',
							style: TextStyle(fontSize: 22.0),
						),
					),
					Container(
						child: Column(
							children: <Widget>[
								Row(
									mainAxisAlignment: MainAxisAlignment.spaceAround,
									children: <Widget>[
										TextButton(
											onPressed: _hasSpeech ? null : initSpeechState,
											child: Text('Initialize'),
										),
									],
								),
								Row(
									mainAxisAlignment: MainAxisAlignment.spaceAround,
									children: <Widget>[
										TextButton(
											onPressed: !_hasSpeech || speech.isListening
												? null
												: startListening,
											child: Text('Start'),
										),
										TextButton(
											onPressed: speech.isListening ? stopListening : null,
											child: Text('Stop'),
										),
										TextButton(
											onPressed: speech.isListening ? cancelListening : null,
											child: Text('Cancel'),
										),
									],
								),
								Row(
									mainAxisAlignment: MainAxisAlignment.spaceAround,
									children: <Widget>[
										DropdownButton(
											onChanged: (selectedVal) => _switchLang(selectedVal),
											value: _currentLocaleId,
											items: _localeNames
												.map(
													(localeName) => DropdownMenuItem(
													value: localeName.localeId,
													child: Text(localeName.name),
													),
												)
												.toList(),
										),
									],
								)
							],
						),
					),
					Expanded(
						flex: 4,
						child: Column(
							children: <Widget>[
								Center(
									child: Text(
										'Recognized Words',
										style: TextStyle(fontSize: 22.0),
									),
								),
								Expanded(
									child: Stack(
										children: <Widget>[
											Container(
												color: Theme.of(context).selectedRowColor,
												child: Center(
													child: Text(
														lastWords,
														textAlign: TextAlign.center,
													),
												),
											),
											Positioned.fill(
												bottom: 10,
												child: Align(
													alignment: Alignment.bottomCenter,
													child: Container(
														width: 40,
														height: 40,
														alignment: Alignment.center,
														decoration: BoxDecoration(
															boxShadow: [
																BoxShadow(
																	blurRadius: .26,
																	spreadRadius: level * 1.5,
																	color: Colors.black.withOpacity(.05))
															],
															color: Colors.white,
															borderRadius: BorderRadius.all(Radius.circular(50)),
														),
														child: IconButton(
															icon: Icon(Icons.mic),
															onPressed: () => null,
														),
													),
												),
											),
										],
									),
								),
							],
						),
					),
					Expanded(
						flex: 1,
						child: Column(
							children: <Widget>[
								Center(
									child: Text(
										'Error Status',
										style: TextStyle(fontSize: 22.0),
									),
								),
								Center(
									child: Text(lastError),
								),
							],
						),
					),
					Container(
						padding: EdgeInsets.symmetric(vertical: 20),
						color: Theme.of(context).backgroundColor,
						child: Center(
							child: speech.isListening
								? Text(
									"I'm listening...",
									style: TextStyle(fontWeight: FontWeight.bold),
									)
								: Text(
									'Not listening',
									style: TextStyle(fontWeight: FontWeight.bold),
									),
						),
					),
				]),
			)
		);
	}

	void startListening() {
		lastWords = '';
		lastError = '';
		speech.listen(
			onResult: resultListener,
			listenFor: Duration(seconds: 30),
			pauseFor: Duration(seconds: 5),
			partialResults: false,
			localeId: _currentLocaleId,
			onSoundLevelChange: soundLevelListener,
			cancelOnError: true,
			listenMode: ListenMode.confirmation);
		setState(() {});
	}

	void stopListening() {
		speech.stop();
		setState(() {
			level = 0.0;
		});
	}

	void cancelListening() {
		speech.cancel();
		setState(() {
			level = 0.0;
		});
	}

	void resultListener(SpeechRecognitionResult result) {
		++resultListened;
		print('Result listener $resultListened');
		sendVoiceCommand(result.recognizedWords);
		setState(() {
			lastWords = '${result.recognizedWords} - ${result.finalResult}';
		});
	}

	void soundLevelListener(double level) {
		minSoundLevel = min(minSoundLevel, level);
		maxSoundLevel = max(maxSoundLevel, level);
		// print("sound level $level: $minSoundLevel - $maxSoundLevel ");
		setState(() {
			this.level = level;
		});
	}

	void errorListener(SpeechRecognitionError error) {
		// print("Received error status: $error, listening: ${speech.isListening}");
		setState(() {
			lastError = '${error.errorMsg} - ${error.permanent}';
		});
	}

	void statusListener(String status) {
		// print(
		// 'Received listener status: $status, listening: ${speech.isListening}');
		setState(() {
			lastStatus = '$status';
		});
	}

	void _switchLang(selectedVal) {
		setState(() {
			_currentLocaleId = selectedVal;
		});
		print(selectedVal);
	}
}