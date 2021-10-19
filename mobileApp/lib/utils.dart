import "package:flutter/material.dart";

// Size deviceDim;

navigate(BuildContext context, String routeName, { dynamic params = null }) {
	Navigator.pushNamed(context, routeName, arguments: params);
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