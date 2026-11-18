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

    dc.setColor(Graphics.COLOR_WHITE, Graphics.COLOR_BLACK);
    dc.clear();

    var clockTime = System.getClockTime();
    var hours = clockTime.hour % 12;
    var minutes = clockTime.min;
    var seconds = clockTime.sec;

    // Track rings
    dc.setPenWidth((10 * s).toNumber());
    dc.setColor(Graphics.COLOR_DK_GRAY, Graphics.COLOR_BLACK);
    dc.drawCircle(cx, cy, (100 * s).toNumber());
    dc.setPenWidth((8 * s).toNumber());
    dc.drawCircle(cx, cy, (75 * s).toNumber());
    dc.setPenWidth((6 * s).toNumber());
    dc.drawCircle(cx, cy, (50 * s).toNumber());

    // Progress arcs (fraction of full circle, clockwise from 12 o'clock)
    drawProgressArc(dc, cx, cy, 100 * s, ((hours + minutes / 60.0) / 12.0), 10, Graphics.COLOR_RED);
    drawProgressArc(dc, cx, cy, 75 * s, minutes / 60.0, 8, Graphics.COLOR_RED);
    drawProgressArc(dc, cx, cy, 50 * s, seconds / 60.0, 6, Graphics.COLOR_WHITE);

    // Seconds end dot
    var sp = polar(cx, cy, 50 * s, seconds * 6.0);
    dc.setColor(Graphics.COLOR_WHITE, Graphics.COLOR_BLACK);
    dc.fillCircle(sp[0].toNumber(), sp[1].toNumber(), (7 * s).toNumber());

    // Center time
    var text = hours.format("%02d") + ":" + minutes.format("%02d");
    dc.setColor(Graphics.COLOR_RED, Graphics.COLOR_BLACK);
    dc.drawText(cx, cy - 10, Graphics.FONT_MEDIUM, text, Graphics.TEXT_JUSTIFY_CENTER);
  }

  function polar(cx as Lang.Number, cy as Lang.Number, r as Lang.Float, deg as Lang.Float) as Lang.Array {
    var rad = deg * Math.PI / 180.0;
    return [cx + r * Math.sin(rad), cy - r * Math.cos(rad)];
  }

  function drawProgressArc(dc as Dc, cx as Lang.Number, cy as Lang.Number, r as Lang.Float, frac as Lang.Float, width as Lang.Number, color as Lang.Number) as Void {
    var sweep = frac * 360.0;
    if (sweep <= 0.0) {
      return;
    }
    dc.setPenWidth(width);
    dc.setColor(color, Graphics.COLOR_BLACK);
    var steps = (sweep / 6.0).toNumber();
    var prev = polar(cx, cy, r, 0.0);
    for (var i = 1; i <= steps; i++) {
      var p = polar(cx, cy, r, i * 6.0);
      dc.drawLine(prev[0].toNumber(), prev[1].toNumber(), p[0].toNumber(), p[1].toNumber());
      prev = p;
    }
  }
}
