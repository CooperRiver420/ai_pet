//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
let electron = require("electron");
let path = require("path");
let electron_store = require("electron-store");
electron_store = __toESM(electron_store);
let crypto = require("crypto");
//#region src/main/window.ts
var PetWindow = class {
	window = null;
	x = 100;
	y = 100;
	create() {
		const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
		this.window = new electron.BrowserWindow({
			width: 800,
			height: 600,
			x: this.x,
			y: this.y,
			frame: false,
			transparent: true,
			alwaysOnTop: true,
			resizable: false,
			skipTaskbar: true,
			focusable: false,
			hasShadow: false,
			webPreferences: {
				preload: (0, path.join)(__dirname, "../preload/index.js"),
				contextIsolation: true,
				nodeIntegration: false
			}
		});
		this.window.setIgnoreMouseEvents(false);
		if (process.env.VITE_DEV_SERVER_URL) this.window.loadURL(process.env.VITE_DEV_SERVER_URL);
		else this.window.loadFile((0, path.join)(__dirname, "../../dist/index.html"));
		this.setupDrag();
	}
	setupDrag() {
		this.window?.on("moved", () => {
			const [x, y] = this.window?.getPosition() ?? [0, 0];
			this.x = x;
			this.y = y;
		});
	}
	getPosition() {
		return {
			x: this.x,
			y: this.y
		};
	}
	setPosition(x, y) {
		this.window?.setPosition(x, y);
		this.x = x;
		this.y = y;
	}
	getWindow() {
		return this.window;
	}
	show() {
		this.window?.show();
	}
	hide() {
		this.window?.hide();
	}
};
//#endregion
//#region src/main/tray.ts
var PetTray = class {
	tray = null;
	create() {
		this.tray = new electron.Tray(electron.nativeImage.createFromBuffer(Buffer.from([
			137,
			80,
			78,
			71,
			13,
			10,
			26,
			10,
			0,
			0,
			0,
			13,
			73,
			72,
			68,
			82,
			0,
			0,
			0,
			16,
			0,
			0,
			0,
			16,
			8,
			6,
			0,
			0,
			0,
			31,
			243,
			255,
			97,
			0,
			0,
			0,
			1,
			115,
			82,
			71,
			66,
			0,
			174,
			206,
			28,
			233,
			0,
			0,
			0,
			4,
			103,
			65,
			77,
			65,
			0,
			0,
			177,
			143,
			11,
			252,
			97,
			5,
			0,
			0,
			0,
			9,
			112,
			72,
			89,
			115,
			0,
			0,
			14,
			195,
			0,
			0,
			14,
			195,
			1,
			199,
			111,
			168,
			100,
			0,
			0,
			0,
			47,
			73,
			68,
			65,
			84,
			56,
			79,
			99,
			248,
			255,
			255,
			63,
			3,
			37,
			128,
			137,
			129,
			77,
			24,
			25,
			0,
			105,
			103,
			96,
			100,
			192,
			54,
			104,
			136,
			24,
			0,
			105,
			103,
			96,
			100,
			192,
			54,
			104,
			136,
			24,
			0,
			105,
			103,
			96,
			100,
			192,
			54,
			104,
			136,
			24,
			0,
			105,
			103,
			96,
			100,
			192,
			54,
			0,
			0,
			166,
			48,
			2,
			216,
			58,
			227,
			215,
			0,
			0,
			0,
			0,
			73,
			69,
			78,
			68,
			174,
			66,
			96,
			130
		])));
		this.tray.setToolTip("AI Pet");
		const contextMenu = electron.Menu.buildFromTemplate([
			{
				label: "显示宠物",
				click: () => {}
			},
			{
				label: "隐藏宠物",
				click: () => {}
			},
			{ type: "separator" },
			{
				label: "设置",
				click: () => {}
			},
			{ type: "separator" },
			{
				label: "退出",
				click: () => electron.app.quit()
			}
		]);
		this.tray.setContextMenu(contextMenu);
		this.tray.on("click", () => {
			this.tray?.popUpContextMenu();
		});
	}
	destroy() {
		this.tray?.destroy();
	}
};
//#endregion
//#region src/main/store.ts
function generateEncryptionKey() {
	const seed = `${process.platform}-${process.arch}-ai-pet-2026`;
	return (0, crypto.createHash)("sha256").update(seed).digest("hex").substring(0, 32);
}
var store = new electron_store.default({
	name: "ai-pet-config",
	encryptionKey: generateEncryptionKey(),
	defaults: {
		petPosition: {
			x: 100,
			y: 100
		},
		pets: [{
			id: "cat_001",
			name: "小橘",
			type: "cat",
			unlocked: true
		}],
		settings: {
			scale: 2,
			frameRate: 10
		}
	}
});
function getPetPosition() {
	return store.get("petPosition", {
		x: 100,
		y: 100
	});
}
function setPetPosition(x, y) {
	store.set("petPosition", {
		x,
		y
	});
}
//#endregion
//#region src/main/ipc.ts
function validatePosition(x, y) {
	const { width: screenWidth, height: screenHeight } = electron.screen.getPrimaryDisplay().workAreaSize;
	const boundary = 100;
	const maxX = screenWidth - boundary;
	const maxY = screenHeight - boundary;
	return {
		x: Math.max(boundary, Math.min(maxX, x)),
		y: Math.max(boundary, Math.min(maxY, y))
	};
}
function setupIPC(petWindow) {
	electron.ipcMain.handle("get-pet-position", () => {
		return getPetPosition();
	});
	electron.ipcMain.handle("set-pet-position", (_, x, y) => {
		if (typeof x !== "number" || typeof y !== "number") return {
			success: false,
			error: "Invalid coordinates"
		};
		const validPos = validatePosition(x, y);
		setPetPosition(validPos.x, validPos.y);
		petWindow.setPosition(validPos.x, validPos.y);
		return {
			success: true,
			position: validPos
		};
	});
	electron.ipcMain.handle("get-pets", () => {
		return store.get("pets", []);
	});
}
//#endregion
//#region src/main/index.ts
var petWindow;
var petTray;
electron.app.whenReady().then(() => {
	petWindow = new PetWindow();
	petWindow.create();
	petTray = new PetTray();
	petTray.create();
	setupIPC(petWindow);
	electron.app.on("activate", () => {
		if (electron.BrowserWindow.getAllWindows().length === 0) petWindow.create();
	});
});
electron.app.on("window-all-closed", () => {
	if (process.platform !== "darwin") electron.app.quit();
});
//#endregion
