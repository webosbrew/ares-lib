// noinspection JSUnusedGlobalSymbols

import {Client} from 'ssh2';
import {Readable, Writable} from 'stream';

export type RunOutput = Writable | ((buf: Buffer) => void) | null;

export interface Callback<T> {
    (error?: Error, result?: T): void;
}

export type CallbackReturn<T> = T | NodeJS.Immediate | void;

export class Resolver {
    readonly devices: Device[];

    constructor();

    load(next: (error: any, result: any) => void): void;

    save(devicesData: Device[], next?: Callback<Device[]>): CallbackReturn<Device[]>;

    modifyDeviceFile(op: 'add' | 'modify' | 'default' | 'remove', device: Partial<DeviceEditSpec>, next?: Callback<Device[]>): CallbackReturn<Device[]>;
}

type AresResolver = Resolver;

export class Session {
    readonly ssh: Client;

    constructor(target: string, printTarget: string, next: (error: any) => void);

    run(cmd: string, stdin: Readable | null, stdout: RunOutput, stderr: RunOutput, next: (error: any, result: any) => void): void;

    runWithOption(cmd: string, opts: any, stdin: Readable | null, stdout: RunOutput, stderr: RunOutput, next: (error: any, result: any) => void): void;

    get(inPath: string, outPath: string, next: (error: any, result: any) => void): void;

    put(inPath: string, outPath: string, next: (error: any, result: any) => void): void;

    end(): this;
}

type AresSession = Session;

export interface Device {
    name: string;
    description: string;
    host: string;
    port: number;
    indelible: boolean;
    default: boolean;
    files: string;
    username: string;
    privateKey?: Buffer;
    passphrase?: string;
    password?: string;
    lunaAddr: {
        launch: LunaAddress;
    };
}

export interface LunaOptions {
    session: Session;
    nReplies?: number;
    sessionCall?: boolean;
    sessionId?: string;
}

export interface LunaAddress {
    service: string;
    folder: string;
    method: string;
}

export namespace Luna {
    function send(options: LunaOptions, addr: LunaAddress, param: any,
                  onResponse: (response: any, next: Callback<Device[]>) => void, next?: Callback<Device[]>);

    function sendWithoutErrorHandle(options: LunaOptions, addr: LunaAddress, param: any,
                                    onResponse: (response: any, next: Callback<Device[]>) => void, next?: Callback<Device[]>);
}

export interface InstallOptions {
    device?: string;
    session?: Session;

    [key: string]: any;
}

export interface LaunchOptions {
    device?: string;
    session?: Session;

    inspect?: boolean;
}

export interface DeviceEditSpec {
    name: string;
    host: string;
    port: number;
    username: string;
    profile: 'ose';
    privateKey?: { openSsh: string };
    passphrase?: string;
    password?: string;

    description?: string;
    default?: boolean;
}

export class Luna {

}

export interface CliAppDataType {

    getPath(next?: (error: any, result: string) => void): string | NodeJS.Immediate;

    getAppDir(next?: (error: any, result: string) => void): void | NodeJS.Immediate;

    getConfig(next?: (error: any, result: any) => void): any | NodeJS.Immediate;

    compareProfile(query: string, next?: (error: any, result: boolean) => void): void;

    compareProfileSync(query: string): boolean;

    getDeviceList(renewal: boolean, next?: (error: any, result: any) => void): Device[] | NodeJS.Immediate;

    getCommandService(next?: (error: any, result: any) => void): any | NodeJS.Immediate;

    setDeviceList(deviceListData: Device[], next?: (error: any, result: Device[]) => void): Device[] | NodeJS.Immediate;

    setConfig(configData: any, next?: (error: any, result: any) => void): any | NodeJS.Immediate;

    setTemplate(templateData: any, next?: (error: any, result: any) => void): any | NodeJS.Immediate;

    setKey(keyPath: string, next?: (error: any, result: any) => void): string | NodeJS.Immediate;

    setQuery(queryBasePath: string, next?: (error: any, result: any) => void): string | NodeJS.Immediate;

    resetDeviceList(next?: (error: any, result: Device[]) => void): Device[] | NodeJS.Immediate;
}

export function CliAppData(): CliAppDataType;

export interface PackageInfo {
    id: string;
    type: string;
    title: string;
    appDescription?: string;
    vendor: string;
    version: string;
    folderPath: string;
    icon: string;
}

export interface RunningApp {
    id: string;
}

export namespace promises {

    import Dict = NodeJS.Dict;

    export class Resolver {
        readonly devices: Device[];

        readonly delegate: AresResolver;

        constructor();

        load(): Promise<void>;

        save(devicesData): Promise<Device[]>;

        modifyDeviceFile(op: 'add' | 'modify' | 'default' | 'remove', device: Partial<DeviceEditSpec>): Promise<Device[]>;
    }

    export class Session {
        readonly ssh: Client;

        readonly delegate: AresSession;

        private constructor();

        run(cmd: string, stdin: Readable | null, stdout: RunOutput, stderr: RunOutput): Promise<any>;

        runWithOption(cmd: string, opts: any, stdin: Readable | null, stdout: RunOutput, stderr: RunOutput): Promise<void>;

        get(inPath: string, outPath: string): Promise<void>;

        put(inPath: string, outPath: string): Promise<void>;

        end(): this;

        static create(target: string): Promise<Session>;
    }

    export class CliAppData {

        getPath(): Promise<string>;

        getAppDir(): Promise<string>;

        getConfig(): Promise<any>;

        compareProfile(query: string): Promise<boolean>;

        getDeviceList(renewal: boolean): Promise<Device[]>;

        getCommandService(): Promise<any>;

        setDeviceList(deviceListData: Device[]): Promise<Device[]>;

        setConfig(configData: any): Promise<any>;

        setTemplate(templateData: any): Promise<any>;

        setKey(keyPath: string): Promise<string>;

        setQuery(queryBasePath: string): Promise<string>;

        resetDeviceList(): Promise<Device[]>;

        static getInstance(): CliAppData;

    }

    export class Luna {

        static send<Params, Response>(options: LunaOptions, launch: LunaAddress, params: Params): Promise<Response>;

        static sendWithoutErrorHandle<Params, Response>(options: LunaOptions, launch: LunaAddress, params: Params): Promise<Response>;
    }

    export class Installer {
        static list(options: InstallOptions): Promise<PackageInfo[]>;

        static install(options: InstallOptions, path: string): Promise<void>;

        static remove(options: InstallOptions, pkgName: string): Promise<void>;
    }

    export class Launcher {
        static launch(options: LaunchOptions, appId: string, params: Dict<any>): Promise<void>;

        static close(options: LaunchOptions, appId: string, params: Dict<any>): Promise<void>;

        static listRunningApp(options: LaunchOptions): Promise<RunningApp>;
    }
}