import Toybox.Application;
import Toybox.Lang;
import Toybox.WatchUi;

class HandsApp extends Application.AppBase {
  function initialize() {
    AppBase.initialize();
  }

  function onStart(state as Dictionary?) as Void {
  }

  function onStop(state as Dictionary?) as Void {
  }

  function getInitialView() as [Views] or [Views, InputDelegates] {
    return [new HandsView()];
  }
}

function getApp() as HandsApp {
  return Application.getApp() as HandsApp;
}
