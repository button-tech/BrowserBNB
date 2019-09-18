import {Component, OnInit} from '@angular/core';
import {Location} from "@angular/common";
import {StateService} from "../../../../../services/state.service";
import {CurrencySymbols} from "../../../../../constants";




@Component({
    selector: 'app-general',
    templateUrl: './general.component.html',
    styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {

    languagesList = [
        {value: 1, label: 'English'},
        {value: 2, label: 'Russian', disabled: true},
        {value: 3, label: 'French', disabled: true},
        {value: 4, label: 'Chinese Traditional', disabled: true}
    ];



    currenciesList = [
        {value: 1, label: CurrencySymbols.USD},
        {value: 2, label: CurrencySymbols.EUR},
        {value: 3, label: CurrencySymbols.RUB},
        {value: 4, label: CurrencySymbols.CNY, disabled: true},
    ];

    selectedLanguage = null;
    selectedCurrency = null;

    constructor(private location: Location, private state: StateService) {

    }

    select() {
        this.state.selectBaseFiatCurrency(this.selectedCurrency.label);
    }


    ngOnInit() {
        this.selectedLanguage = this.languagesList[0];
        this.selectedCurrency = this.currenciesList
                .find((Val) => Val.label === this.state.uiState$.getValue().storageData.baseFiatCurrency);
    }

    goBack() {
        this.location.back();
    }
}
