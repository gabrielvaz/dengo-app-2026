import 'package:flutter/material.dart';

void main() {
  runApp(const DengoApp());
}

class DengoApp extends StatelessWidget {
  const DengoApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Dengo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF800020)), // Deep burgundy
        useMaterial3: true,
      ),
      home: const Scaffold(
        body: Center(
          child: Text('Dengo'),
        ),
      ),
    );
  }
}