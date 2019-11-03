import {Injectable} from '@angular/core';

@Injectable()
export class LocalStorageService {

    constructor() {
    }

    get currentBlockchain(): string {
        return this.getData("blockchain") || "binance";
    }

    set currentBlockchain(value: string) {
        this.setData("blockchain", value);
    }

    public resetBlockchain() {
        localStorage.removeItem("blockchain");
    }

    private getData(key: string): string {
        return (window as any).localStorage.getItem(key);
    }

    private setData(key: string, value: string): void {
        (window as any).localStorage.setItem(key, value);
    }

}
