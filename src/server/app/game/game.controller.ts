import * as Express from "express";
import GameService from "./game.service";
import LogService from "../core/log.service";

export default class GameController {
    static $inject = [
        'logService',
        'gameService'
    ];

    constructor(
        private logService: LogService,
        private gameService: GameService
    ) {
    }

    router(): Express.RequestHandler {
        var router = Express.Router();
        router.get("/", (req, res) => {
            res.setHeader('Cache-Control', 'no-store');
            res.json(this.gameService.games);
        });
        router.post('/reload', (req, res) => {
            // Reload only the configured directory; never accept filesystem paths over HTTP.
            const origin = req.get('origin');
            if (origin && origin !== req.protocol + '://' + req.get('host')) {
                res.status(403).json({ error: 'Cross-origin reload is not allowed.' });
                return;
            }
            res.setHeader('Cache-Control', 'no-store');
            this.gameService.scan().then(games => res.json(games), error => {
                this.logService.error('ROM scan failed', error);
                res.status(500).json({ error: 'ROM directory is unavailable or unreadable. Check the NAS directory and application permissions.' });
            });
        });
        return router;
    }
}
