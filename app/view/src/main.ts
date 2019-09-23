import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

if (environment.production) {
    enableProdMode();
}

if (window['global'] === undefined) {
    window['global'] = window;
}

platformBrowserDynamic().bootstrapModule(AppModule).then(ref => {
    // debugger
    // Ensure Angular destroys itself on hot reloads.
    if (window['ngRef']) {
        window['ngRef'].destroy();
    }
    window['ngRef'] = ref;

    // Otherwise, log the boot error
}).catch(err => console.error(err));
