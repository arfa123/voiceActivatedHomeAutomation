import "package:flutter/material.dart";

// Size deviceDim;

navigate(BuildContext context, String routeName) {
	Navigator.pushNamed(context, routeName);
}

navigateClearStack(BuildContext context, String routeName){
	Navigator.pushNamedAndRemoveUntil(context, routeName, (Route<dynamic> route) => false);
}

navigateBack(BuildContext context) {
	Navigator.pop(context);
}

// setDeviceDimension(Size size) {
// 	print("setDeviceDimension $size");
// 	deviceDim = size;
// }