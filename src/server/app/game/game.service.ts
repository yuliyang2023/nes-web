import * as fs from 'fs';
import * as path from 'path';
import LogService from '../core/log.service';
import { Game } from './game.model';

export default class GameService {
    games: Game[] = [];
    private scanning: Promise<Game[]>;
    readonly romDirectory = path.resolve(process.env.NES_ROM_DIR || __dirname + '/../../../data/roms');
    readonly screenDirectory = path.resolve(process.env.NES_SCREEN_DIR || __dirname + '/../../../data/screen');

    static $inject = ['logService'];
    constructor(private logService: LogService) { }

    scan(): Promise<Game[]> {
        if (this.scanning) return this.scanning;
        this.scanning = new Promise<Game[]>((resolve, reject) => {
            fs.readdir(this.romDirectory, (error, files) => {
                if (error) { reject(error); return; }
                const candidates = files.filter(file => file.endsWith('.nes'));
                Promise.all(candidates.map(file => new Promise<string>((ok, fail) => {
                    fs.stat(path.join(this.romDirectory, file), (statError, stat) => {
                        if (statError) { fail(statError); return; }
                        ok(stat.isFile() ? file.slice(0, -4) : null);
                    });
                }))).then(names => {
                    fs.readFile(path.join(this.romDirectory, 'singleplayer.txt'), 'utf8', (readError, content) => {
                        if (readError && readError.code !== 'ENOENT') { reject(readError); return; }
                        const singleplayer = readError ? [] : content.split('\n').map(name => name.trim());
                        const games = names.filter(name => name !== null).sort().map(name => ({
                            name, multiplayer: singleplayer.indexOf(name) < 0
                        }));
                        // Replace atomically: deletions and empty directories must clear the list.
                        this.games = games;
                        this.logService.info('ROM scan complete: ' + games.length + ' games');
                        resolve(games);
                    });
                }, reject);
            });
        });
        const pending = this.scanning;
        pending.then(() => { this.scanning = null; }, () => { this.scanning = null; });
        return pending;
    }
}
