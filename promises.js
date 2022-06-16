// noinspection JSUnusedGlobalSymbols,DuplicatedCode

const {promisify} = require('util');

const {Resolver: AresResolver, Session: AresSession} = require('@webosose/ares-cli/lib/base/novacom');
const AresLuna = require('@webosose/ares-cli/lib/base/luna');
const AresLauncher = require('@webosose/ares-cli/lib/launch');
const AresInstaller = require('@webosose/ares-cli/lib/install');
const AresCliAppData = require('@webosose/ares-cli/lib/base/cli-appdata');
const {Device} = require("./index");

class Resolver {
    constructor() {
        const delegate = new AresResolver();
        Object.defineProperty(this, 'devices', {
            get: () => delegate.devices,
        });
        this.load = promisify(delegate.load).bind(delegate);
        this.save = promisify(delegate.save).bind(delegate);
        this.modifyDeviceFile = promisify(delegate.modifyDeviceFile).bind(delegate);
        this.delegate = delegate;
    }
}


class Session {
    /**
     * @param {AresSession} delegate
     * @constructor
     */
    constructor(delegate) {
        this.delegate = delegate;
        this.put = promisify(AresSession.prototype.put).bind(delegate);
        this.get = promisify(AresSession.prototype.get).bind(delegate);
        this.run = promisify(AresSession.prototype.run).bind(delegate);
        this.runWithOption = promisify(AresSession.prototype.runWithOption).bind(delegate);
        this.runNoHangup = promisify(AresSession.prototype.runNoHangup).bind(delegate);
        this.forward = promisify(AresSession.prototype.forward).bind(delegate);
        this.getLocalPortByDevicePort = promisify(AresSession.prototype.getLocalPortByDevicePort).bind(delegate);
        this.getLocalPortByName = promisify(AresSession.prototype.getLocalPortByName).bind(delegate);
        this.runHostedAppServer = promisify(AresSession.prototype.runHostedAppServer).bind(delegate);
        this.setHostedAppServerPort = promisify(AresSession.prototype.setHostedAppServerPort).bind(delegate);
        this.getHostedAppServerPort = promisify(AresSession.prototype.getHostedAppServerPort).bind(delegate);
        this.end = AresSession.prototype.end.bind(delegate);
        this.getDevice = AresSession.prototype.getDevice.bind(delegate);
        this.ssh = delegate['ssh'];
    }

    /**
     * @param {String} target
     */
    static create(target) {
        return new Promise((resolve, reject) => {
            const session = new AresSession(target, target, (e) => {
                if (e) {
                    reject(e);
                } else {
                    resolve(new Session(session));
                }
            });
        })
    }
}

class CliAppData {
    static instance;

    constructor(delegate) {
        this.delegate = delegate;
        this.getPath = promisify(delegate.getPath);
        this.getAppDir = promisify(delegate.getAppDir);
        this.getConfig = promisify(delegate.getConfig);
        this.compareProfile = promisify(delegate.compareProfile);
        this.getDeviceList = promisify(delegate.getDeviceList);
        this.getCommandService = promisify(delegate.getCommandService);
        this.setDeviceList = promisify(delegate.setDeviceList);
        this.setConfig = promisify(delegate.setConfig);
        this.setTemplate = promisify(delegate.setTemplate);
        this.setKey = promisify(delegate.setKey);
        this.setQuery = promisify(delegate.setQuery);
        this.resetDeviceList = promisify(delegate.resetDeviceList);
    }

    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new CliAppData(AresCliAppData());
        return this.instance;
    }
}

// noinspection JSUnusedGlobalSymbols
const Luna = {
    send: promisify(AresLuna.send),
    sendWithoutErrorHandle: promisify(AresLuna.sendWithoutErrorHandle),
};

const Installer = {
    list: promisify(AresInstaller.list),
    install: promisify(AresInstaller.install),
    remove: promisify(AresInstaller.remove),
};

const Launcher = {
    launch: promisify(AresLauncher.launch),
    close: promisify(AresLauncher.close),
    listRunningApp: promisify(AresLauncher.listRunningApp),
};

module.exports = {
    Resolver, Session, Luna, Installer, Launcher, CliAppData
};