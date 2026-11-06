using Toybox.Graphics;
using Toybox.System as Sys;
using Toybox.WatchUi;

(:background)
class ExampleView extends WatchUi.WatchFace {
  var counter = 0;

  function initialize() {
    WatchFace.initialize();
  }

  function onLayout(dc as Dc) as Void {
    setLayout(Rez.Layouts.ExampleLayout(dc));
  }

  function onUpdate(dc as Dc) as Void {
    var screenWidth = dc.getWidth();
    var screenHeight = dc.getHeight();
    var radius = 240 / 3.14;

    // Greeting
    dc.setColor(Graphics.COLOR_WHITE, Graphics.COLOR_BLACK);
    dc.clear();
    dc.drawText(
    screenWidth / 2,
    screenHeight / 2,
    Graphics.FONT_SYSTEM_SMALL,
    "Hello Garmin",
    Graphics.TEXT_JUSTIFY_CENTER
    );

    counter += 1;
    if (counter > 10 && Sys.getClockTime().sec == 0) {
      counter = 0;
    }

    /* Block comment with a hex and a float: 0xFF, 3.14 */
    Sys.println(0xFF);
  }
}
