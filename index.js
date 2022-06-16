const {Resolver, Session} = require('@webosose/ares-cli/lib/base/novacom');
const Cli = require('@webosose/ares-cli/lib/base/cli-appdata');
const Luna = require('@webosose/ares-cli/lib/base/luna');
const Installer = require('@webosose/ares-cli/lib/install');
const Launcher = require('@webosose/ares-cli/lib/launch');
const novacomPromises = require('./promises');

function CliAppData() {
    return Cli.CliAppData();
}

module.exports = {
    Resolver,
    Session,
    CliAppData,
    Luna,
    Installer,
    Launcher,
    promises: novacomPromises,
};