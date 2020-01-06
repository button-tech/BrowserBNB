import {BehaviorSubject, Observable} from "rxjs";
// import {take} from "rxjs/operators";

const ActivatedWidget: BehaviorSubject<WidgetMessaging> = new BehaviorSubject<WidgetMessaging>(new WidgetMessaging(null, null));

class WidgetMessaging {

    // passwordPort$: Observable<any>;
    // walletConnectPort$: Observable<any>;

    // session: Session;
    // walletConnect: [
    //     isConnected
    // ];

    constructor(private passwordPort$: Observable<any>, private passwordPort$: Observable<any>) {

        // Work with port

        // Wor with wallet connect
    }

    requestForSessionApprove(): Observable<any> {

    }

    requestTransactionApprove(): Observable<any> {

    }

    askUserFortWalletConnectSessionApprove(): Observable<boolean> {
        //
        // 1) Check behavior subject - do we have any active is So, us one
        //
    }

    connect() {
        // ???
    }

    disconnect() {
        // ???
    }

    // sen

    // static open(): Widget {
    //     // return walletConnectPortUi$;
    //     return new Widget();
    // }
}


export function OpenWidget(): Observable<WidgetMessaging> {
    const url = `index.html?state="registration/import"`;
    window.open(url, "extension_popup", "width=350,height=590,status=no,scrollbars=yes,resizable=no");

    // TODO: may be don't open if it's open already and return current widget

    return ActivatedWidget.asObservable()

    // .pipe(
    //     take(1)
    // );
}
