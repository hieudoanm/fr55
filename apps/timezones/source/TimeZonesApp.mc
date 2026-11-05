import Toybox.Application;
import Toybox.Lang;
import Toybox.WatchUi;

class TimeZonesApp extends Application.AppBase {
  function initialize() {
    AppBase.initialize();
  }

  function onStart(state as Dictionary?) as Void {
  }

  function onStop(state as Dictionary?) as Void {
  }

  function getInitialView() as [Views] or [Views, InputDelegates] {
    return [new TimeZonesView()];
  }
}

function getApp() as TimeZonesApp {
  return Application.getApp() as TimeZonesApp;
}
