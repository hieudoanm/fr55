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

    dc.setColor(Graphics.COLOR_WHITE, Graphics.COLOR_BLACK);
    dc.clear();

    // Golden-angle dot spiral: r = k*sqrt(i), theta = i * 137.5 degrees
    var k = 18.6;
    for (var i = 0; i <= 30; i++) {
      var r = k * Math.sqrt(i) * s;
      var theta = i * 137.5 * Math.PI / 180.0;
      var x = cx + r * Math.cos(theta);
      var y = cy + r * Math.sin(theta);
      var rad = (i == 30) ? (4.5 * s) : (3.0 * s);
      if (i == 30) {
        dc.setColor(Graphics.COLOR_RED, Graphics.COLOR_BLACK);
      } else if (i % 3 == 0) {
        dc.setColor(Graphics.COLOR_WHITE, Graphics.COLOR_BLACK);
      } else {
        dc.setColor(Graphics.COLOR_LT_GRAY, Graphics.COLOR_BLACK);
      }
      dc.fillCircle(x.toNumber(), y.toNumber(), rad.toNumber());
    }

    // Center time
    var clockTime = System.getClockTime();
    var hours = clockTime.hour % 12;
    if (hours == 0) {
      hours = 12;
    }
    var text = hours.format("%02d") + ":" + clockTime.min.format("%02d");
    dc.setColor(Graphics.COLOR_RED, Graphics.COLOR_BLACK);
    dc.drawText(cx, (cy + m * 0.08).toNumber(), Graphics.FONT_MEDIUM, text, Graphics.TEXT_JUSTIFY_CENTER);
  }
}
