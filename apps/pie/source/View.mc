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

    // 12 pie sectors; alternate dark grays, current hour in red
    var sectorR = half * 0.875;
    for (var i = 0; i < 12; i++) {
      var a0 = i * 30.0;
      var a1 = a0 + 30.0;
      var pts = [[cx, cy]];
      var a = a0;
      while (a <= a1) {
        var p = polar(cx, cy, sectorR, a);
        pts.add([p[0], p[1]]);
        a += 10.0;
      }
      var pend = polar(cx, cy, sectorR, a1);
      pts.add([pend[0], pend[1]]);
      if (i == hours) {
        dc.setColor(Graphics.COLOR_RED, Graphics.COLOR_BLACK);
      } else {
        dc.setColor((i % 2 == 0) ? Graphics.COLOR_BLACK : Graphics.COLOR_DK_GRAY, Graphics.COLOR_BLACK);
      }
      dc.fillPolygon(pts);
    }

    // Minute hand
    var rad = minutes * 6.0 * Math.PI / 180.0;
    var len = sectorR * 0.95;
    dc.setPenWidth((4 * s).toNumber());
    dc.setColor(Graphics.COLOR_WHITE, Graphics.COLOR_BLACK);
    dc.drawLine(cx, cy, (cx + len * Math.sin(rad)).toNumber(), (cy - len * Math.cos(rad)).toNumber());

    // Center time
    var text = hours.format("%02d") + ":" + minutes.format("%02d");
    dc.setColor(Graphics.COLOR_WHITE, Graphics.COLOR_BLACK);
    dc.drawText(cx, (cy - 2).toNumber(), Graphics.FONT_MEDIUM, text, Graphics.TEXT_JUSTIFY_CENTER);
  }

  // angle in degrees clockwise from 12 o'clock
  function polar(cx as Lang.Number, cy as Lang.Number, r as Lang.Float, deg as Lang.Float) as Lang.Array {
    var rad = deg * Math.PI / 180.0;
    return [cx + r * Math.sin(rad), cy - r * Math.cos(rad)];
  }
}
