import Toybox.Graphics;
import Toybox.Lang;
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

    dc.setColor(Graphics.COLOR_WHITE, Graphics.COLOR_BLACK);
    dc.clear();

    var clockTime = System.getClockTime();
    var hour = clockTime.hour;
    var minute = clockTime.min;

    // Labels
    dc.setColor(Graphics.COLOR_LT_GRAY, Graphics.COLOR_BLACK);
    dc.drawText(w * 0.1, m * 0.4, Graphics.FONT_SMALL, "H", Graphics.TEXT_JUSTIFY_CENTER);
    dc.drawText(w * 0.1, m * 0.64, Graphics.FONT_SMALL, "M", Graphics.TEXT_JUSTIFY_CENTER);

    // Hour: 5 bits (0-23); minute: 6 bits (0-59). Wide red bar = 1, thin dark bar = 0.
    drawBars(dc, w, m, hour, 5, (m * 0.4).toNumber());
    drawBars(dc, w, m, minute, 6, (m * 0.64).toNumber());
  }

  function drawBars(dc as Dc, w as Lang.Number, m as Lang.Number, value as Lang.Number, bits as Lang.Number, y as Lang.Number) as Void {
    var x0 = w * 0.22;
    var x1 = w * 0.85;
    var slot = (x1 - x0) / bits;
    var barH = m * 0.2;
    var y0 = y - barH / 2.0;

    // bits MSB-first
    var arr = [];
    var v = value;
    for (var i = 0; i < bits; i++) {
      arr.add(v % 2);
      v = (v / 2).toNumber();
    }

    for (var i = 0; i < bits; i++) {
      var on = arr[bits - 1 - i] == 1;
      var bw = on ? slot * 0.28 : slot * 0.08;
      var bx = x0 + i * slot + (slot - bw) / 2.0;
      dc.setColor(on ? Graphics.COLOR_RED : Graphics.COLOR_DK_GRAY, Graphics.COLOR_BLACK);
      dc.fillRectangle(bx.toNumber(), y0.toNumber(), bw.toNumber(), barH.toNumber());
    }
  }
}
