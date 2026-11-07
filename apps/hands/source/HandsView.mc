import Toybox.Graphics;
import Toybox.Lang;
import Toybox.Math;
import Toybox.System;
import Toybox.WatchUi;

class HandsView extends WatchUi.WatchFace {
  function initialize() {
    WatchFace.initialize();
  }

  // Load your resources here
  function onLayout(dc as Dc) as Void {
    setLayout(Rez.Layouts.HandsLayout(dc));
  }

  function onShow() as Void {
    WatchUi.requestUpdate(WatchUi.UPDATE_EVERY_MINUTE);
  }

  function onUpdate(dc as Dc) as Void {
    // Draw a circle at the center
    var screenWidth = dc.getWidth();
    var screenHeight = dc.getHeight();
    var centerX = screenWidth / 2;
    var centerY = screenHeight / 2;
    // Clean Screen
    dc.setColor(Graphics.COLOR_WHITE, Graphics.COLOR_BLACK);
    dc.clear();
    // Clock
    var clockTime = System.getClockTime();
    var hours = clockTime.hour % 12;
    var minutes = clockTime.min;

    // Convert to angles
    var hourAngle = (hours * 30) + (minutes / 60.0 * 30); // Hour moves slightly with minutes
    var minuteAngle = minutes * 6;

    // Draw hour hand (shorter)
    drawHand(dc, centerX, centerY, hourAngle, screenWidth * 0.35, 6);

    // Draw minute hand (longer)
    drawHand(dc, centerX, centerY, minuteAngle, screenWidth * 0.45, 4);
  }

  function drawHand(dc as Dc, x as Lang.Number, y as Lang.Number, angle as Lang.Float, length as Lang.Float, thickness as Lang.Number) as Void {
    var rad = angle * Math.PI / 180;
    var endX = x + length * Math.sin(rad);
    var endY = y - length * Math.cos(rad);

    dc.setPenWidth(thickness);
    dc.setColor(Graphics.COLOR_RED, Graphics.COLOR_BLACK);
    dc.drawLine(x, y, endX.toNumber(), endY.toNumber());
  }
}
