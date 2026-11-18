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

    dc.setColor(Graphics.COLOR_WHITE, Graphics.COLOR_BLACK);
    dc.clear();

    var clockTime = System.getClockTime();
    var hours = clockTime.hour % 12;
    var minutes = clockTime.min;

    // Divider
    dc.setPenWidth(1);
    dc.setColor(Graphics.COLOR_DK_GRAY, Graphics.COLOR_BLACK);
    dc.drawLine((w * 0.08).toNumber(), (h / 2).toNumber(), (w * 0.92).toNumber(), (h / 2).toNumber());

    // Mini analog dial in the top half: center (cx, 0.367h), radius 0.325m
    var dialCy = h * 0.367;
    var dialR = m * 0.325;

    dc.setPenWidth((3 * s).toNumber());
    dc.setColor(Graphics.COLOR_DK_GRAY, Graphics.COLOR_BLACK);
    dc.drawCircle(cx, dialCy, dialR.toNumber());

    // 12 tick marks
    dc.setPenWidth(1);
    dc.setColor(Graphics.COLOR_LT_GRAY, Graphics.COLOR_BLACK);
    for (var i = 0; i < 12; i++) {
      var a = i * 30.0;
      var rad = a * Math.PI / 180.0;
      var x1 = cx + (dialR - 8 * s) * Math.sin(rad);
      var y1 = dialCy - (dialR - 8 * s) * Math.cos(rad);
      var x2 = cx + dialR * Math.sin(rad);
      var y2 = dialCy - dialR * Math.cos(rad);
      dc.drawLine(x1.toNumber(), y1.toNumber(), x2.toNumber(), y2.toNumber());
    }

    // Hands on the mini dial
    drawHand(dc, cx, dialCy.toNumber(), hours * 30.0 + minutes / 60.0 * 30.0, dialR * 0.67, 5, Graphics.COLOR_RED);
    drawHand(dc, cx, dialCy.toNumber(), minutes * 6.0, dialR * 0.85, 4, Graphics.COLOR_RED);
    dc.fillCircle(cx.toNumber(), dialCy.toNumber(), (4 * s).toNumber());

    // Big digital time in the bottom half
    var text = hours.format("%02d") + ":" + minutes.format("%02d");
    dc.setColor(Graphics.COLOR_RED, Graphics.COLOR_BLACK);
    dc.drawText(cx, (h * 0.8).toNumber(), Graphics.FONT_LARGE, text, Graphics.TEXT_JUSTIFY_CENTER);
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
