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
    var m = (w < h ? w : h);
    var s = m / 240.0;
    var cx = w / 2;
    var cy = h / 2;
    var half = m / 2.0;

    dc.setColor(Graphics.COLOR_WHITE, Graphics.COLOR_BLACK);
    dc.clear();

    var clockTime = System.getClockTime();
    var hours = clockTime.hour % 12;
    var minutes = clockTime.min;

    // Cardinal letters
    var r = half * 0.82;
    dc.setColor(Graphics.COLOR_RED, Graphics.COLOR_BLACK);
    dc.drawText(cx, (cy - r).toNumber(), Graphics.FONT_MEDIUM, "N", Graphics.TEXT_JUSTIFY_CENTER);
    dc.setColor(Graphics.COLOR_WHITE, Graphics.COLOR_BLACK);
    dc.drawText((cx + r).toNumber(), cy, Graphics.FONT_MEDIUM, "E", Graphics.TEXT_JUSTIFY_CENTER);
    dc.drawText(cx, (cy + r).toNumber(), Graphics.FONT_MEDIUM, "S", Graphics.TEXT_JUSTIFY_CENTER);
    dc.drawText((cx - r).toNumber(), cy, Graphics.FONT_MEDIUM, "W", Graphics.TEXT_JUSTIFY_CENTER);

    // Needles: red = minute hand, gray = hour hand
    drawNeedle(dc, cx, cy, minutes * 6.0, half * 0.6, 6, Graphics.COLOR_RED);
    drawNeedle(dc, cx, cy, hours * 30.0 + minutes / 60.0 * 30.0, half * 0.3, 3, Graphics.COLOR_LT_GRAY);

    dc.setPenWidth(1);
    dc.setColor(Graphics.COLOR_RED, Graphics.COLOR_BLACK);
    dc.fillCircle(cx.toNumber(), cy.toNumber(), (6 * s).toNumber());

    // Time readout
    var text = hours.format("%02d") + ":" + minutes.format("%02d");
    dc.setColor(Graphics.COLOR_LT_GRAY, Graphics.COLOR_BLACK);
    dc.drawText(cx, (cy + half * 0.92).toNumber(), Graphics.FONT_SMALL, text, Graphics.TEXT_JUSTIFY_CENTER);
  }

  function drawNeedle(dc as Dc, x as Lang.Number, y as Lang.Number, angle as Lang.Float, length as Lang.Float, thickness as Lang.Number, color as Lang.Number) as Void {
    var rad = angle * Math.PI / 180.0;
    var endX = x + length * Math.sin(rad);
    var endY = y - length * Math.cos(rad);
    dc.setPenWidth(thickness);
    dc.setColor(color, Graphics.COLOR_BLACK);
    dc.drawLine(x, y, endX.toNumber(), endY.toNumber());
  }
}
