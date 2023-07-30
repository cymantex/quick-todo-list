import { app, BrowserWindow } from "electron";

export function handleWindowEvents(win?: BrowserWindow) {
  app.on("second-instance", () => {
    if (win) {
      // Focus on the main window if the user tried to open another
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });
}
