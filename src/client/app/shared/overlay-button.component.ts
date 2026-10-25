import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'overlay-button',
    templateUrl: 'overlay-button.component.html'
})
export class OverlayButtonComponent {
    @Input() routerLink: string
    @Input() icon: string
    @Input() position: string

    get label(): string {
        if (this.icon === 'back') return 'Back';
        if (this.icon === 'fullscreen') return 'Fullscreen';
        return 'Settings';
    }
}
