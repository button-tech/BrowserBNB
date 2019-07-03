import {Component, OnInit} from '@angular/core';
import {MemoryService} from '../services/memory.service';
import {Router} from "@angular/router";
import {StorageService} from "../services/storage.service";

@Component({
    selector: 'app-greeter',
    templateUrl: './greeter.component.html',
    styleUrls: ['./greeter.component.css']
})
export class GreeterComponent implements OnInit {

    constructor(private router: Router, private storage: StorageService, private memory: MemoryService) {

        try {
            this.storage.get();

            this.delay(50).then(() => {
                try {
                    const storageKeystore = this.memory.getCurrentKeystore();
                    console.log(`INITED KEY ${storageKeystore}`);

                    if (storageKeystore !== "" && storageKeystore !== 'default keystore') {
                        this.memory.setCurrentKeystore(storageKeystore);
                        this.router.navigate(['/unlock']);
                    }
                }
                catch (e) {
                    console.log(e)
                }
            })

        }
        catch (e) {
            console.log(e)
        }
    }

    async delay(ms: number) {
        await new Promise(resolve => setTimeout(() => resolve(), ms)).then(() => console.log("fired"));
    }

    ngOnInit() {

    }
}
