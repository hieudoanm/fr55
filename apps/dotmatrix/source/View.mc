import Toybox.Graphics;
import Toybox.Lang;
import Toybox.System;
import Toybox.WatchUi;

class View extends WatchUi.WatchFace {
  // 3x5 dot-matrix glyphs, rows top-to-bottom, 3 columns left-to-right
  var GLYPHS = {
    "0" => [[1,1,1],[1,0,1],[1,0,1],[1,0,1],[1,1,1]],
    "1" => [[0,1,0],[0,1,1],[0,1,0],[0,1,0],[0,1,0]],
    "2" => [[1,1,1],[0,0,1],[1,1,1],[1,0,0],[1,1,1]],
    "3" => [[1,1,1],[0,0,1],[1,1,1],[0,0,1],[1,1,1]],
    "4" => [[1,0,1],[1,0,1],[1,1,1],[0,0,1],[0,0,1]],
    "5" => [[1,1,1],[1,0,0],[1,1,1],[0,0,1],[1,1,1]],
    "6" => [[1,1,1],[1,0,0],[1,1,1],[1,0,1],[1,1,1]],
    "7" => [[1,1,1],[0,0,1],[0,1,0],[0,1,0],[0,1,0]],
    "8" => [[1,1,1],[1,0,1],[1,1,1],[1,0,1],[1,1,1]],
    "9" => [[1,1,1],[1,0,1],[1,1,1],[0,0,1],[1,1,1]],
    ":" => [[0,0,0],[0,1,0],[0,0,0],[0,1,0],[0,0,0]],
  };

  function initialize() {
    WatchFace.initialize();
  }

  function onUpdate(dc as Dc) as Void {
    var w = dc.getWidth();
    var h = dc.getHeight();
    var m = (w < h ? w : h);
    var cx = w / 2;
    var cy = h / 2;

    dc.setColor(Graphics.COLOR_WHITE, Graphics.COLOR_BLACK);
    dc.clear();

    var clockTime = System.getClockTime();
    var hh = clockTime.hour % 12;
    if (hh == 0) {
      hh = 12;
    }
    var hourStr = hh.format("%02d");
    var minStr = clockTime.min.format("%02d");
    var text = hourStr + ":" + minStr;

    var gap = m * 0.05;
    var pitch = gap * 4.0;
    var r = (gap * 0.35).toNumber();
    var left = cx - 2.0 * pitch - gap;
    var top = cy - 2.0 * gap;

    for (var i = 0; i < text.length(); i++) {
      var glyph = GLYPHS[text.substring(i, i + 1)];
      if (glyph == null) {
        continue;
      }
      var gx = left + i * pitch;
      for (var row = 0; row < 5; row++) {
        for (var col = 0; col < 3; col++) {
          var on = glyph[row][col] == 1;
          dc.setColor(on ? Graphics.COLOR_RED : Graphics.COLOR_DK_GRAY, Graphics.COLOR_BLACK);
          dc.fillCircle((gx + col * gap).toNumber(), (top + row * gap).toNumber(), r);
        }
      }
    }
  }
}
