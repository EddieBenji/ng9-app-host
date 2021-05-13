import { Component } from '@angular/core';
import { LoadService } from './load.service';
import { PopupService } from './popup.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: [ './app.component.scss' ]
})
export class AppComponent {

    constructor(public popup: PopupService,
      loadService: LoadService) {
        loadService.initialize();
    }
}
