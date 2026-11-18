import Toybox.Lang;

class HandsTests {
  (:test)
  static function testHourHandAngle(logger) as Boolean {
    Toybox.Test.assertEqual(0.0, hourHandAngle(0, 0));
    Toybox.Test.assertEqual(30.0, hourHandAngle(1, 0));
    // At 12:30 the hour hand sits halfway between 12 and 1.
    Toybox.Test.assertEqual(15.0, hourHandAngle(0, 30));
    // 11:59 → 359.5°
    Toybox.Test.assertEqual(359.5, hourHandAngle(11, 59));
    return true;
  }

  (:test)
  static function testMinuteHandAngle(logger) as Boolean {
    Toybox.Test.assertEqual(0.0, minuteHandAngle(0));
    Toybox.Test.assertEqual(30.0, minuteHandAngle(5));
    Toybox.Test.assertEqual(354.0, minuteHandAngle(59));
    return true;
  }
}
