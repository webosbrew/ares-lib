// noinspection JSUnusedGlobalSymbols

import {Client} from 'ssh2';
import {Readable, Writable} from 'stream';


export type RunOutput = Writable | ((buf: Buffer) => void) | null;

export class Resolver {
    readonly devices: Device[];

    constructor();

    load(next: (error: any, result: any) => void): void;

    save(devicesData, next: (error: any, result: Device[]) => void): void;

    modifyDeviceFile(op: 'add' | 'modify' | 'default' | 'remove', device: Partial<DeviceEditSpec>, next: (error: any, result: Device[]) => void): void;
}

export class Session {
    readonly ssh: Client;

    constructor(target: string, printTarget: string, next: (error: any) => void);

    run(cmd: string, stdin: Readable | null, stdout: RunOutput, stderr: RunOutput, next: (error: any, result: any) => void): void;

    runWithOption(cmd: string, opts: any, stdin: Readable | null, stdout: RunOutput, stderr: RunOutput, next: (error: any, result: any) => void): void;

    get(inPath: string, outPath: string, next: (error: any, result: any) => void): void;

    put(inPath: string, outPath: string, next: (error: any, result: any) => void): void;

    end(): this;
}

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
    returnValue: string;
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

export class CliAppData {
    constructor();

    getPath(next: (error: any, result: string) => void): void;
}

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

        constructor();

        load(): Promise<void>;

        save(devicesData): Promise<Device[]>;

        modifyDeviceFile(op: 'add' | 'modify' | 'default' | 'remove', device: Partial<DeviceEditSpec>): Promise<Device[]>;
    }

    export class Session {
        readonly ssh: Client;

        private constructor();

        run(cmd: string, stdin: Readable | null, stdout: RunOutput, stderr: RunOutput): Promise<any>;

        runWithOption(cmd: string, opts: any, stdin: Readable | null, stdout: RunOutput, stderr: RunOutput): Promise<void>;

        get(inPath: string, outPath: string): Promise<void>;

        put(inPath: string, outPath: string): Promise<void>;

        end(): this;

        static create(target: string): Promise<Session>;
    }

    export class CliAppData {
        constructor();

        getPath(): Promise<string>;
    }

    export class Luna {

        static send(options: LunaOptions, launch: LunaAddress, params: any): Promise<any>;

        static sendWithoutErrorHandle(options: LunaOptions, launch: LunaAddress, params: any): Promise<any>;
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