
import 'package:flutter_test/flutter_test.dart';
import 'package:dengo_app/main.dart';

void main() {
  testWidgets('App title is Dengo', (WidgetTester tester) async {
    await tester.pumpWidget(const DengoApp());
    expect(find.text('Dengo'), findsOneWidget);
  });
}
