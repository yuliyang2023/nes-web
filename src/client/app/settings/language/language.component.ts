import { Component, Output, EventEmitter, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonEvent, GamepadService, ButtonEventType } from '../../core/gamepad.service';
import { Unsubscribable } from '../../core/unsubscribable';
import { Configuration } from '../../core/configuration';

@Component({
    templateUrl: 'language.component.html'
})
export class LanguageComponent implements OnInit, OnDestroy {
    private subscriptions: Unsubscribable[] = [];
    private languages = ['en', 'vi', 'zh-CN'];

    get lang(): string {
        return this.configuration.lang || 'en';
    }

    constructor(
        private router: Router,
        private configuration: Configuration,
        private gamepadService: GamepadService
    ) {
    }

    ngOnInit() {
        this.subscriptions.push(
            this.gamepadService.on(ButtonEventType.buttonDown, this.buttonDown.bind(this))
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    click(lang: string) {
        this.configuration.lang = lang;
        this.router.navigateByUrl('/settings');
    }

    private cycleLanguage(direction: number) {
        const index = this.languages.indexOf(this.lang);
        this.configuration.lang = this.languages[
            (index + direction + this.languages.length) % this.languages.length
        ];
    }

    buttonDown(event: ButtonEvent): boolean {
        switch (event.button) {
        case 'tab':
            this.cycleLanguage(1);
            return true;
        case 'ls1':
            this.router.navigateByUrl('/settings');
            return true;
        case 'l':
        case 'u':
            this.cycleLanguage(-1);
            return true;
        case 'r':
        case 'd':
            this.cycleLanguage(1);
            return true;
        case 'select':
            this.cycleLanguage(1);
            return true;
        case 'start':
            this.router.navigateByUrl('/settings');
            return true;
        }
        return false;
    }
}
