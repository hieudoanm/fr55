import Toybox.Graphics;
import Toybox.Lang;
import Toybox.System;
import Toybox.WatchUi;

class View extends WatchUi.WatchFace {
  // Star field in 240x240 design space
  var STARS = [[84.8, 33.6], [150.2, 26.5], [31.6, 65.7], [27.5, 59.0], [34.0, 28.2], [44.8, 40.1], [215.3, 24.2], [191.7, 46.1], [48.9, 30.6]];

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

    // Stars
    dc.setColor(Graphics.COLOR_LT_GRAY, Graphics.COLOR_BLACK);
    for (var i = 0; i < STARS.length(); i++) {
      var sx = cx + (STARS[i][0] - 120.0) * s;
      var sy = cy + (STARS[i][1] - 120.0) * s;
      dc.fillCircle(sx.toNumber(), sy.toNumber(), (1.8 * s).toNumber());
    }

    // Moon: dark disc with a lighter offset disc giving a crescent
    var moonCx = cx;
    var moonCy = cy - 25 * s;
    var moonR = 52 * s;
    dc.setColor(Graphics.COLOR_DK_GRAY, Graphics.COLOR_BLACK);
    dc.fillCircle(moonCx.toNumber(), moonCy.toNumber(), moonR.toNumber());
    dc.setColor(Graphics.COLOR_LT_GRAY, Graphics.COLOR_BLACK);
    dc.fillCircle((moonCx - 16 * s).toNumber(), (moonCy - 11 * s).toNumber(), (46 * s).toNumber());
    dc.setPenWidth(1);
    dc.setColor(Graphics.COLOR_WHITE, Graphics.COLOR_BLACK);
    dc.drawCircle(moonCx, moonCy, moonR.toNumber());

    // Time
    var clockTime = System.getClockTime();
    var hours = clockTime.hour % 12;
    if (hours == 0) {
      hours = 12;
    }
    var text = hours.format("%02d") + ":" + clockTime.min.format("%02d");
    dc.setColor(Graphics.COLOR_RED, Graphics.COLOR_BLACK);
    dc.drawText(cx, (cy + m * 0.32).toNumber(), Graphics.FONT_LARGE, text, Graphics.TEXT_JUSTIFY_CENTER);
  }
}
