let electron = require("electron");
//#region src/preload/index.ts
electron.contextBridge.exposeInMainWorld("electronAPI", {
	platform: process.platform,
	versions: {
		node: process.versions.node,
		chrome: process.versions.chrome,
		electron: process.versions.electron
	},
	getPetPosition: () => electron.ipcRenderer.invoke("get-pet-position"),
	setPetPosition: (x, y) => electron.ipcRenderer.invoke("set-pet-position", x, y),
	getPets: () => electron.ipcRenderer.invoke("get-pets")
});
//#endregion
