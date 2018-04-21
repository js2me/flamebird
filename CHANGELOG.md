
# Changelog


## [1.5.0] - 2018-04-21

### Added
- `fb` - additional command name for the calling flamebird
- command `flamebird web` - launch webview of flamebird application and working with all processes from webview 
- option `-p, --package` for commands `start` and `web` which needs for using `package.json` as the managing tasks instead of `Procfile`
- option `-t, --tasks [tasks]` for commands `start` and `web` which needs for setting specific tasks which needs to the working
- option `-P, --port <PORT>` for `web` command. Sets the server port. By default 5050 value


## [1.0.0] - 2018-04-18

### Added
- command `flamebird start` for the launching all commands in Procfile
- option `-j, --procfile <FILE>` for the loading `Procfile` from `<FILE>` . by default using `./Procfile` path