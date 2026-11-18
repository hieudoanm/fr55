import Toybox.Graphics;
import Toybox.Lang;
import Toybox.Math;
import Toybox.System;
import Toybox.WatchUi;

class View extends WatchUi.WatchFace {
  function initialize() {
    WatchFace.initialize();
  }

  function onUpdate(dc as Dc) as Void {
    var w = dc.getWidth();
    var h = dc.getHeight();
    var s = (w < h ? w : h) / 240.0;
    var cx = w / 2;
    var cy = h / 2;
    var half = (w < h ? w : h) / 2.0;

    dc.setColor(Graphics.COLOR_WHITE, Graphics.COLOR_BLACK);
    dc.clear();

    var clockTime = System.getClockTime();
    var hours = clockTime.hour % 12;
    var minutes = clockTime.min;
    var seconds = clockTime.sec;

    // Tick ring: bold hour markers, thin minute markers
    for (var i = 0; i < 60; i++) {
      var major = (i % 5 == 0);
      var a0 = i * 6.0;
      var rIn = major ? 88.0 : 98.0;
      var rOut = 110.0;
      var p1 = polar(cx, cy, rIn * s, a0);
      var p2 = polar(cx, cy, rOut * s, a0);
      dc.setPenWidth(major ? 3 : 2);
      dc.setColor(major ? Graphics.COLOR_LT_GRAY : Graphics.COLOR_DK_GRAY, Graphics.COLOR_BLACK);
      dc.drawLine(p1[0].toNumber(), p1[1].toNumber(), p2[0].toNumber(), p2[1].toNumber());
    }

    // Hands
    drawHand(dc, cx, cy, hours * 30.0 + minutes / 60.0 * 30.0, half * 0.48, 7, Graphics.COLOR_RED);
    drawHand(dc, cx, cy, minutes * 6.0, half * 0.72, 5, Graphics.COLOR_RED);
    drawHand(dc, cx, cy, seconds * 6.0, half * 0.78, 2, Graphics.COLOR_LT_GRAY);

    dc.setPenWidth(1);
    dc.setColor(Graphics.COLOR_RED, Graphics.COLOR_BLACK);
    dc.fillCircle(cx.toNumber(), cy.toNumber(), (5 * s).toNumber());
  }

  // angle in degrees clockwise from 12 o'clock; returns [x, y]
  function polar(cx as Lang.Number, cy as Lang.Number, r as Lang.Float, deg as Lang.Float) as Lang.Array {
    var rad = deg * Math.PI / 180.0;
    return [cx + r * Math.sin(rad), cy - r * Math.cos(rad)];
  }

  function drawHand(dc as Dc, x as Lang.Number, y as Lang.Number, angle as Lang.Float, length as Lang.Float, thickness as Lang.Number, color as Lang.Number) as Void {
    var rad = angle * Math.PI / 180.0;
    var endX = x + length * Math.sin(rad);
    var endY = y - length * Math.cos(rad);
    dc.setPenWidth(thickness);
    dc.setColor(color, Graphics.COLOR_BLACK);
    dc.drawLine(x, y, endX.toNumber(), endY.toNumber());
  }
}
