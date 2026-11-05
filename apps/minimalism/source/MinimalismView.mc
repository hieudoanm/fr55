import Toybox.Activity;
import Toybox.Graphics;
import Toybox.Math;
import Toybox.System;
import Toybox.WatchUi;

class MinimalismView extends WatchUi.WatchFace {
  function initialize() {
    WatchFace.initialize();
  }

  // Load your resources here
  function onLayout(dc as Dc) as Void {
    setLayout(Rez.Layouts.MinimalismLayout(dc));
  }

  // Called when this View is brought to the foreground. Restore
  // the state of this View and prepare it to be shown. This includes
  // loading resources into memory.
  function onShow() as Void {
  }

  // Update the view
  function onUpdate(dc as Dc) as Void {
    var width = dc.getWidth();
    var height = dc.getHeight();
    dc.setColor(Graphics.COLOR_WHITE, Graphics.COLOR_BLACK);
    dc.clear();
    // Get Data
    var centerX = width / 2;
    var centerY = height / 2;
    var radius = (centerX + centerY) / 2.0 / 1.25;
    // Clock
    var clockTime = System.getClockTime();
    var clockHour = clockTime.hour;
    var clockMinute = clockTime.min;
    // Hours
    var hour = clockHour.toFloat() + clockMinute.toFloat() / 60.toFloat();
    var hourAngle = (hour - 3) * 30 * (Math.PI / 180); // Convert to radians
    var hourX = centerX + (radius * Math.cos(hourAngle)); // Use cos() for X
    var hourY = centerY + (radius * Math.sin(hourAngle)); // Use sin() for Y
    dc.setColor(Graphics.COLOR_RED, Graphics.COLOR_BLACK);
    dc.fillCircle(hourX.toNumber(), hourY.toNumber(), 10);
    // Minutes
    var minuteAngle = ((clockMinute + 45) * 6) * (Math.PI / 180); // Convert to radians
    var minuteX = centerX + (radius * Math.cos(minuteAngle)); // Use cos() for X
    var minuteY = centerY + (radius * Math.sin(minuteAngle)); // Use sin() for Y
    dc.fillCircle(minuteX.toNumber(), minuteY.toNumber(), 5);
    // Heart Rate
    var currentHeartRate = Activity.getActivityInfo().currentHeartRate; // get the latest HR if available
    var text = clockHour.format("%02d") + ":" + clockMinute.format("%02d");
    if (currentHeartRate != null) {
      text = currentHeartRate.toString();
    }
    dc.drawText(centerX, centerY - 15, Graphics.FONT_SYSTEM_SMALL, text, Graphics.TEXT_JUSTIFY_CENTER);
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
