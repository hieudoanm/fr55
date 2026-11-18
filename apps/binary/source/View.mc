import Toybox.Graphics;
import Toybox.Lang;
import Toybox.System;
import Toybox.WatchUi;

class View extends WatchUi.WatchFace {
  // 3x5 dot glyphs, rows top-to-bottom, 3 columns left-to-right
  var GLYPHS = {
    "0" => [[1, 1, 1], [1, 0, 1], [1, 0, 1], [1, 0, 1], [1, 1, 1]],
    "1" => [[0, 1, 0], [1, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 1]],
    "2" => [[1, 1, 1], [0, 0, 1], [1, 1, 1], [1, 0, 0], [1, 1, 1]],
    "3" => [[1, 1, 1], [0, 0, 1], [1, 1, 1], [0, 0, 1], [1, 1, 1]],
    "4" => [[1, 0, 1], [1, 0, 1], [1, 1, 1], [0, 0, 1], [0, 0, 1]],
    "5" => [[1, 1, 1], [1, 0, 0], [1, 1, 1], [0, 0, 1], [1, 1, 1]],
    "6" => [[1, 1, 1], [1, 0, 0], [1, 1, 1], [1, 0, 1], [1, 1, 1]],
    "7" => [[1, 1, 1], [0, 0, 1], [0, 1, 0], [0, 1, 0], [0, 1, 0]],
    "8" => [[1, 1, 1], [1, 0, 1], [1, 1, 1], [1, 0, 1], [1, 1, 1]],
    "9" => [[1, 1, 1], [1, 0, 1], [1, 1, 1], [0, 0, 1], [1, 1, 1]],
  };

  function initialize() {
    WatchFace.initialize();
  }

  function onUpdate(dc as Dc) as Void {
    var w = dc.getWidth();
    var h = dc.getHeight();
    var m = (w < h ? w : h);
    var cx = w / 2;

    dc.setColor(Graphics.COLOR_WHITE, Graphics.COLOR_BLACK);
    dc.clear();

    var clockTime = System.getClockTime();
    var hour = clockTime.hour;
    var minute = clockTime.min;

    // Hour needs 5 bits (0-23), minute needs 6 bits (0-59)
    drawBitRow(dc, cx, (m * 0.38).toNumber(), hour, 5, m);
    drawBitRow(dc, cx, (m * 0.62).toNumber(), minute, 6, m);

    dc.setColor(Graphics.COLOR_LT_GRAY, Graphics.COLOR_BLACK);
    dc.drawText(w * 0.08, m * 0.38, Graphics.FONT_SMALL, "H", Graphics.TEXT_JUSTIFY_CENTER);
    dc.drawText(w * 0.08, m * 0.62, Graphics.FONT_SMALL, "M", Graphics.TEXT_JUSTIFY_CENTER);
  }

  function drawBitRow(dc as Dc, cx as Lang.Number, y as Lang.Number, value as Lang.Number, bits as Lang.Number, m as Lang.Number) as Void {
    var spacing = m * 0.105;
    var startX = cx - (spacing * (bits - 1)) / 2.0;
    var r = (m * 0.046).toNumber();
    // build bits MSB-first
    var arr = [];
    var v = value;
    for (var i = 0; i < bits; i++) {
      arr.add(v % 2);
      v = (v / 2).toNumber();
    }
    for (var i = 0; i < bits; i++) {
      var on = arr[bits - 1 - i] == 1;
      dc.setColor(on ? Graphics.COLOR_RED : Graphics.COLOR_DK_GRAY, Graphics.COLOR_BLACK);
      dc.fillCircle((startX + i * spacing).toNumber(), y.toNumber(), r);
    }
  }
}
