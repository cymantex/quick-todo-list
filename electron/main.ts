import { app } from "electron";
import { join } from "node:path";
import { handleWindowEvents } from "./setup/handleWindowEvents";
import { createWindow } from "./setup/createWindow";

process.env.DIST_ELECTRON = join(__dirname, "../");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, "../public")
  : process.env.DIST;

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

async function main() {
  const win = await createWindow({
    preload: join(__dirname, "preload.js"),
    url: process.env.VITE_DEV_SERVER_URL,
    indexHtml: join(process.env.DIST, "index.html")
  });
  await handleWindowEvents(win);
}

app.whenReady().then(main);
