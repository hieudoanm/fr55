import Toybox.Graphics;
import Toybox.Lang;
import Toybox.System;
import Toybox.Time;
import Toybox.WatchUi;

class TimeZonesView extends WatchUi.WatchFace {
  function initialize() {
    WatchFace.initialize();
  }

  // Load your resources here
  function onLayout(dc as Dc) as Void {
    setLayout(Rez.Layouts.TimeZonesLayout(dc));
  }

  function getHourForTimezone(offsetHours as Lang.Float) {
    var deviceTime = System.getClockTime();// Get local device time
    var gmtOffset = deviceTime.timeZoneOffset / 60.0 / 60.0;// Convert minutes to hours
    var gmtHour = deviceTime.hour - gmtOffset;// Convert to GMT

    var targetHour = (gmtHour + offsetHours).toNumber() % 24;

    // Ensure positive hour values (Monkey C can return negative mod results)
    if (targetHour < 0) {
      targetHour += 24;
    }

    return targetHour;
  }

  // Update the view
  function onUpdate(dc as Dc) as Void {
    // Get Position
    var width = dc.getWidth();
    var height = dc.getHeight();
    var centerX = width / 2;
    var centerY = height / 2;
    // Clear Screen
    dc.setColor(Graphics.COLOR_WHITE, Graphics.COLOR_BLACK);
    dc.clear();
    // Clock
    var clockTime = System.getClockTime();
    var clockHour = clockTime.hour;
    var clockMinute = clockTime.min;
    // TimeZones
    var londonOffset = 0.0;// UTC+0
    var melbourneOffset = 10.0;// UTC+10 (standard time, no DST)
    var londonHour = getHourForTimezone(londonOffset);
    var melbourneHour = getHourForTimezone(melbourneOffset);
    // Text
    var londonText = londonHour.format("%02d") + ":" + clockMinute.format("%02d");
    var saigonText = clockHour.format("%02d") + ":" + clockMinute.format("%02d");
    var melbourneText = melbourneHour.format("%02d") + ":" + clockMinute.format("%02d");
    var text = londonText + "\n" + saigonText + "\n" + melbourneText;
    dc.setColor(Graphics.COLOR_RED, Graphics.COLOR_BLACK);
    dc.drawText(centerX, centerY - 60, Graphics.FONT_SYSTEM_NUMBER_MILD, text, Graphics.TEXT_JUSTIFY_CENTER);
  }

  // Called when this View is brought to the foreground. Restore
  // the state of this View and prepare it to be shown. This includes
  // loading resources into memory.
  function onShow() as Void {
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
