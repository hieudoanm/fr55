import Toybox.Graphics;
import Toybox.Lang;
import Toybox.System;
import Toybox.WatchUi;

class TimeZonesView extends WatchUi.WatchFace {
  function initialize() {
    WatchFace.initialize();
  }

  // Load your resources here
  function onLayout(dc as Dc) as Void {
    setLayout(Rez.Layouts.TimeZonesLayout(dc));
  }

  function getTimeForTimezone(offsetHours as Lang.Float) as Lang.String {
    var deviceTime = System.getClockTime();
    // Work in minutes so half-hour UTC offsets and day rollover stay correct
    var targetMinutes = deviceTime.hour * 60 + deviceTime.min
    - deviceTime.timeZoneOffset + offsetHours * 60;
    targetMinutes = targetMinutes % 1440;
    if (targetMinutes < 0) {
      targetMinutes += 1440;
    }
    var hour = (targetMinutes / 60).toNumber();
    var minute = (targetMinutes % 60).toNumber();
    return hour.format("%02d") + ":" + minute.format("%02d");
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
    var londonOffset = 0.0; // UTC+0
    var melbourneOffset = 10.0; // UTC+10 (standard time, no DST)
    // Text
    var londonText = getTimeForTimezone(londonOffset);
    var saigonText = clockHour.format("%02d") + ":" + clockMinute.format("%02d");
    var melbourneText = getTimeForTimezone(melbourneOffset);
    var text = londonText + "\n" + saigonText + "\n" + melbourneText;
    dc.setColor(Graphics.COLOR_RED, Graphics.COLOR_BLACK);
    dc.drawText(centerX, centerY - 60, Graphics.FONT_SYSTEM_NUMBER_MILD, text, Graphics.TEXT_JUSTIFY_CENTER);
  }

  // Called when this View is brought to the foreground. Restore
  // the state of this View and prepare it to be shown. This includes
  // loading resources into memory.
  function onShow() as Void {
    WatchUi.requestUpdate(WatchUi.UPDATE_EVERY_MINUTE);
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
