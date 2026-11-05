import Toybox.Activity;
import Toybox.Graphics;
import Toybox.Lang;
import Toybox.Math;
import Toybox.System;
import Toybox.WatchUi;

class MaximalismView extends WatchUi.WatchFace {
  var heartRate = "--";

  function initialize() {
    WatchFace.initialize();
  }

  // Load your resources here
  function onLayout(dc as Dc) as Void {
    setLayout(Rez.Layouts.MaximalismLayout(dc));
  }

  // Called when this View is brought to the foreground. Restore
  // the state of this View and prepare it to be shown. This includes
  // loading resources into memory.
  function onShow() as Void {
  }

  // Update the view
  function onUpdate(dc as Dc) as Void {
    // Draw a circle at the center
    var width = dc.getWidth();
    var height = dc.getHeight();
    var centerX = width / 2;
    var centerY = height / 2;
    var radius = (centerX + centerY) / 2.0 / 1.25;
    // Clean Screen
    dc.setColor(Graphics.COLOR_WHITE, Graphics.COLOR_BLACK);
    dc.clear();
    // Clock
    var clockTime = System.getClockTime();
    var clockHour = clockTime.hour;
    var clockMinute = clockTime.min;
    // Hours
    for (var i = -2; i < 10; i++) {
      var angle = i * 30 * (Math.PI / 180);// Convert degrees to radians
      var x = centerX + (radius * Math.cos(angle));// Use cos() for X
      var y = centerY + (radius * Math.sin(angle));// Use sin() for Y

      var hour = i + 3;
      var dotRadius = 5;
      if (clockHour % 12 == hour) {
        dc.setColor(Graphics.COLOR_RED, Graphics.COLOR_BLACK);
        dotRadius = 10;
      } else {
        dc.setColor(Graphics.COLOR_WHITE, Graphics.COLOR_BLACK);
      }

      dc.fillCircle(x.toNumber(), y.toNumber(), dotRadius);
    }
    // Minutes
    var minuteAngle = ((clockMinute + 45) * 6) * (Math.PI / 180);// Convert to radians
    var minuteX = centerX + (radius * Math.cos(minuteAngle));
    var minuteY = centerY + (radius * Math.sin(minuteAngle));
    dc.setColor(Graphics.COLOR_RED, Graphics.COLOR_BLACK);
    dc.fillCircle(minuteX, minuteY, 5);

    // Get battery level
    var batteryLevel = "--";// Default
    try {
      var systemStats = System.getSystemStats();
      batteryLevel = systemStats.battery.toNumber().toString();
    } catch (ex) {
      batteryLevel = "N/A";// Error handling
    }
    // Heart Rate
    var currentHeartRate = Activity.getActivityInfo().currentHeartRate;//get the latest HR if available
    var heartRate = clockHour.format("%02d") + ":" + clockMinute.format("%02d");
    if (currentHeartRate != null) {
      heartRate = currentHeartRate.toString();
    }
    var text = batteryLevel + "\n" + heartRate;
    dc.drawText(centerX, centerY - 25, Graphics.FONT_SYSTEM_SMALL, text, Graphics.TEXT_JUSTIFY_CENTER);
  }

  // Called when this View is removed from the screen. Save the
  // state of this View here. This includes freeing resources from
  // memory.
  function onHide() as Void {
  }

  // The user has just looked at their watch. Timers and animations may be started here.
  function onExitSleep() as Void {
  }

  // Terminate any active timers and prepare for slow updates.
  function onEnterSleep() as Void {
  }

}
