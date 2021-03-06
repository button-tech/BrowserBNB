import {Injectable} from "@angular/core";
import {Observable, of, Subject} from "rxjs";
import {IChromeApiService} from "./chrome-api.service";
import {FromBackgroundToPageMsg} from "./chrome-api-dto";

@Injectable()
export class ChromeApiMockService implements IChromeApiService {

    msgFromBackground$: Subject<FromBackgroundToPageMsg> = new Subject();

    constructor() {
        // fromEvent(window, 'FROM_BG');
        window.addEventListener('message', (evt: any) => {
            if (!evt.data || !(evt.data.type === "TO_PAGE")) {
                return;
            }
            const msg = evt.data.msg as any as FromBackgroundToPageMsg;
            console.log(msg);
            this.msgFromBackground$.next(msg);
        });
    }

    openNewTab(url: string) {
        window.open(url, '_blank');
    }

    restorePassword(): Observable<string> {
        return of("123");

        // const msg: FromPage2BackgroundMsg = {
        //     type: 'restoreExtensionSessionRequest'
        // };
        //
        // setTimeout(() => {
        //     window.postMessage({type: "TO_BG", msg}, "*");
        // }, 1000);
        //
        // return this.msgFromBackground$.pipe(
        //   tap((x) => {
        //       console.log('msgFromBackground$=', x);
        //   }),
        //   take(1),
        //   map((response: FromBackgroundToPageMsg) => {
        //       console.log('response.password =', response.password);
        //       return (response && response.password) || '';
        //   }),
        //   shareReplay(1)
        // );
    }

    savePassword(password: string): void {
        // console.log('savePassword=', password);
        //
        // const msg: FromPage2BackgroundMsg = {
        //     type: 'startExtensionSession',
        //     password,
        //     timeout: 5000 // 30 seconds keep alive
        // };
        //
        // window.postMessage({type: "TO_BG", msg}, "*");
    }

    dropPassword(): void {
        // const msg: FromPage2BackgroundMsg = {
        //     type: 'dropExtensionSession',
        //     password: '',
        //     timeout: 0
        // };
        //
        // window.postMessage({type: "TO_BG", msg}, "*");
    }

    sendKeepAlive(): void {
        // const msg: FromPage2BackgroundMsg = {
        //     type: 'keepAlive'
        // };
        // window.postMessage({type: "TO_BG", msg}, "*");
    }
}
