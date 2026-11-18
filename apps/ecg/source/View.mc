import Toybox.Activity;
import Toybox.Graphics;
import Toybox.Lang;
import Toybox.System;
import Toybox.WatchUi;

class View extends WatchUi.WatchFace {
  // ECG trace in 240x240 design space
  var TRACE = [[10,128],[50,128],[58,120],[66,132],[74,112],[82,140],[92,128],[230,128]];

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

    var clockTime = System.getClockTime();
    var hours = clockTime.hour % 12;
    if (hours == 0) {
      hours = 12;
    }

    // Time
    var text = hours.format("%02d") + ":" + clockTime.min.format("%02d");
    dc.setColor(Graphics.COLOR_RED, Graphics.COLOR_BLACK);
    dc.drawText(cx, (cy - m * 0.2).toNumber(), Graphics.FONT_LARGE, text, Graphics.TEXT_JUSTIFY_CENTER);

    // Heart rate
    var hr = Activity.getActivityInfo().currentHeartRate;
    var bpm = (hr != null) ? hr.toString() + " BPM" : "-- BPM";
    dc.setColor(Graphics.COLOR_LT_GRAY, Graphics.COLOR_BLACK);
    dc.drawText(cx, (cy + m * 0.32).toNumber(), Graphics.FONT_SMALL, bpm, Graphics.TEXT_JUSTIFY_CENTER);

    // ECG trace
    dc.setPenWidth((4 * s).toNumber());
    dc.setColor(Graphics.COLOR_RED, Graphics.COLOR_BLACK);
    var prev = mapPoint(TRACE[0], cx, cy, s);
    for (var i = 1; i < TRACE.length(); i++) {
      var p = mapPoint(TRACE[i], cx, cy, s);
      dc.drawLine(prev[0].toNumber(), prev[1].toNumber(), p[0].toNumber(), p[1].toNumber());
      prev = p;
    }
  }

  function mapPoint(pt as Lang.Array, cx as Lang.Number, cy as Lang.Number, s as Lang.Float) as Lang.Array {
    return [cx + (pt[0] - 120.0) * s, cy + (pt[1] - 128.0) * s * 1.5];
  }
}
