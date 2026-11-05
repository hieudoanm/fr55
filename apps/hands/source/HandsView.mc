import Toybox.Graphics;
import Toybox.Math;
import Toybox.System;
import Toybox.WatchUi;
import Toybox.Time.Gregorian;

class HandsView extends WatchUi.WatchFace {
  function initialize() {
    WatchFace.initialize();
  }

  // Load your resources here
  function onLayout(dc as Dc) as Void {
    setLayout(Rez.Layouts.HandsLayout(dc));
  }

  function onUpdate(dc) {
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

    // Request update every minute
    WatchUi.requestUpdate();
  }

  function drawHand(dc, x, y, angle, length, thickness) {
    var rad = angle * Math.PI / 180;
    var endX = x + length * Math.sin(rad);
    var endY = y - length * Math.cos(rad);

    dc.setPenWidth(thickness);
    dc.setColor(Graphics.COLOR_RED, Graphics.COLOR_BLACK);
    dc.drawLine(x, y, endX, endY);
  }
}
