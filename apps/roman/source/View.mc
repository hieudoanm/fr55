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
    var cx = w / 2;
    var cy = h / 2;
    var half = m / 2.0;

    dc.setColor(Graphics.COLOR_WHITE, Graphics.COLOR_BLACK);
    dc.clear();

    var clockTime = System.getClockTime();
    var hours = clockTime.hour % 12;
    var minutes = clockTime.min;

    // Cardinal Roman numerals
    var r = half * 0.73;
    dc.setColor(Graphics.COLOR_WHITE, Graphics.COLOR_BLACK);
    dc.drawText(cx, (cy - r).toNumber(), Graphics.FONT_MEDIUM, "XII", Graphics.TEXT_JUSTIFY_CENTER);
    dc.drawText((cx + r).toNumber(), cy, Graphics.FONT_MEDIUM, "III", Graphics.TEXT_JUSTIFY_CENTER);
    dc.drawText(cx, (cy + r).toNumber(), Graphics.FONT_MEDIUM, "VI", Graphics.TEXT_JUSTIFY_CENTER);
    dc.drawText((cx - r).toNumber(), cy, Graphics.FONT_MEDIUM, "IX", Graphics.TEXT_JUSTIFY_CENTER);

    // Hands
    drawHand(dc, cx, cy, hours * 30.0 + minutes / 60.0 * 30.0, half * 0.4, 7, Graphics.COLOR_RED);
    drawHand(dc, cx, cy, minutes * 6.0, half * 0.55, 5, Graphics.COLOR_RED);

    dc.setPenWidth(1);
    dc.setColor(Graphics.COLOR_RED, Graphics.COLOR_BLACK);
    dc.fillCircle(cx.toNumber(), cy.toNumber(), (5 * (m / 240.0)).toNumber());
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
