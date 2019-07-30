import {Component, OnInit, OnDestroy} from '@angular/core';
import {BinanceService} from "../../../services/binance.service";
import {StorageService} from "../../../services/storage.service";
import {Observable, of, combineLatest, timer} from "rxjs";
import {Location} from "@angular/common";
import {map, switchMap} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";

const rawTokensImg = '[{"image":"http://static.binance.org/icon/7df5e4de406a4764971244909ae9fcbf","symbol":"USDSB-1AC","name":"USDS"},{"image":"http://static.binance.org/icon/8fedcd202fb549d28b2f313b2bf97033","symbol":"BNB","name":"Binance Chain Native Token"},{"image":"http://static.binance.org/icon/4023c8d1bb8c4cae86280f1e1b21bbca","symbol":"PLG-D8D","name":"Pledge Coin"},{"image":"http://static.binance.org/icon/9dcafca00ead4995bbc81f83066c77fe","symbol":"HYN-F21","name":"Hyperion Token"},{"image":"http://static.binance.org/icon/1c3c14142c394302ba7f83d0ebf1527b","symbol":"COS-2E4","name":"Contentos"},{"image":null,"symbol":"NEW-09E","name":"NEWTON"},{"image":"http://static.binance.org/icon/e38be2a1c6fe4fe98e468bc9a9b8ae94","symbol":"ONE-5F9","name":"Harmony.One"},{"image":"http://static.binance.org/icon/6433e290113c43fa9d112364d462ec1c","symbol":"CHZ-ECD","name":"Chiliz"},{"image":null,"symbol":"UGAS-B0C","name":"Ultrain Coin"},{"image":"http://static.binance.org/icon/8e7353b2d75340a7994374eb3fcb31b8","symbol":"TOP-491","name":"TOP Network"},{"image":"http://static.binance.org/icon/57f62cb6866547259f0af704c360ae5c","symbol":"BTCB-1DE","name":"Bitcoin BEP2"},{"image":null,"symbol":"FSN-E14","name":"Fusion"},{"image":"http://static.binance.org/icon/20702c0125df48d4acd1ac50c292914c","symbol":"ERD-D06","name":"Elrond"},{"image":"http://static.binance.org/icon/9f07ee07026b45e89d4ac2cf93561942","symbol":"ANKR-E97","name":"ANKR"},{"image":"http://static.binance.org/icon/745459e7ae74454889e6a3f98d51fa6c","symbol":"LTO-BDF","name":"LTO Network"},{"image":"http://static.binance.org/icon/f76773990d5c46ceb212fc23360d752d","symbol":"UND-EBC","name":"United Network Distribution"},{"image":null,"symbol":"TRUE-D84","name":"TrueChain"},{"image":"http://static.binance.org/icon/2391501d961846519e9c28d7e329db6f","symbol":"WICC-01D","name":"WaykiChain Coin"},{"image":"http://static.binance.org/icon/c26ec491643d476fbcddcea7d6c123bc","symbol":"SHR-DB6","name":"ShareToken"},{"image":"http://static.binance.org/icon/db9f45f9a94940deb14e2a0839796374","symbol":"CRPT-8C9","name":"Crypterium Token"},{"image":"http://static.binance.org/icon/bbd69bb4a1e9479894a4f82d9b66e86f","symbol":"MDAB-D42","name":"MDAB"},{"image":"http://static.binance.org/icon/025ce4480c6640908ffe8aa0a14a2eba","symbol":"MITH-C76","name":"Mithril"},{"image":"http://static.binance.org/icon/5af1966c111148d0af4e4522382a0a7e","symbol":"DREP-7D2","name":"DREP"},{"image":"http://static.binance.org/icon/7c9dbecfa48e480b95b151e603953792","symbol":"SPNDB-916","name":"Spendcoin"},{"image":"http://static.binance.org/icon/514aacdd57e945768572f727d8563036","symbol":"LBA-340","name":"Lend-Borrow-Asset"},{"image":"http://static.binance.org/icon/e9fe00b6281b435cb150e1e9f894df3c","symbol":"FTM-A64","name":"Fantom"},{"image":null,"symbol":"LIT-099","name":"LITION"},{"image":"http://static.binance.org/icon/88a5f13cae664443927a7ccdfea35c48","symbol":"GTO-908","name":"Gifto"},{"image":"http://static.binance.org/icon/6e5d425f1f2e43828cbd97fd71069839","symbol":"BZNT-464","name":"Bezant Token"},{"image":"http://static.binance.org/icon/15f4b2e5ec40403aafb662beb526180f","symbol":"CAS-167","name":"CASHAA"},{"image":"http://static.binance.org/icon/380e5782bb244661a44c22701473c06b","symbol":"RUNE-B1A","name":"Rune"},{"image":"http://static.binance.org/icon/c728407eabd74a88bd52bb7c052b1a72","symbol":"RAVEN-F66","name":"Raven Protocol"},{"image":"http://static.binance.org/icon/4898a65813ed4f0c998a8fa3dd9a2aad","symbol":"BLINK-9C6","name":"Blockmason Link"},{"image":"http://static.binance.org/icon/b96eab9fc4d0463ab6addc78b8015efa","symbol":"DOS-120","name":"DOS Network Token"},{"image":"http://static.binance.org/icon/b08ba7631d3f4e04b3e6f2255a0e6a80","symbol":"PHB-2DF","name":"Red Pulse Phoenix Binance"},{"image":"http://static.binance.org/icon/82ff9d77546d482685a0015b331477d4","symbol":"PVT-554","name":"Pivot Token"},{"image":"http://static.binance.org/icon/5e3ea9b6f54d47908136085e67fd70f4","symbol":"BOLT-4C6","name":"BOLT Token"},{"image":"http://static.binance.org/icon/fbe9791c01464025aaa3b46779d19a62","symbol":"MZK-2C7","name":"Muzika"},{"image":"http://static.binance.org/icon/fd3caa2d84b34789b0a35f616049c01c","symbol":"VIDT-F53","name":"V-ID Token"},{"image":null,"symbol":"KAT-7BB","name":"Kambria Token"},{"image":null,"symbol":"DUSK-45E","name":"Dusk Network"},{"image":"http://static.binance.org/icon/c609502f67524f3b96444e6e5d9aa268","symbol":"AWC-986","name":"Atomic Wallet Token"},{"image":null,"symbol":"PIBNB-43C","name":"PCHAIN Token"},{"image":"http://static.binance.org/icon/e17b602816fa4f989a9a748f374bc104","symbol":"VRAB-B56","name":"VERA"},{"image":"http://static.binance.org/icon/5c1720f825ce43619dfc6ae080a8228f","symbol":"BKBT-3A6","name":"Bitwires Token"},{"image":null,"symbol":"CBIX-3C9","name":"Cubiex"},{"image":"http://static.binance.org/icon/c598b3837f7c48c2a9a55edfe1414146","symbol":"HNST-3C9","name":"Honest"},{"image":null,"symbol":"ARN-71B","name":"Aeron"},{"image":"http://static.binance.org/icon/a2d88b0ccd064d0fa1856a95e827baa9","symbol":"ENTRP-C8D","name":"Hut34 Entropy"},{"image":null,"symbol":"COVA-218","name":"Covalent Token"},{"image":null,"symbol":"COTI-CBB","name":"COTI"},{"image":"http://static.binance.org/icon/2145f356a1904e7799006b591dc175c8","symbol":"BCPT-95A","name":"Blockmason Credit Protocol"},{"image":"http://static.binance.org/icon/ecf9b67e64a647f1bb9ac848c4d3dfc4","symbol":"TOMOB-4BC","name":"TomoChain"},{"image":null,"symbol":"AXPR-777","name":"AXPR.B"},{"image":"http://static.binance.org/icon/fbe56cda971b47c8b462c9788d649f33","symbol":"MEETONE-031","name":"MEET.ONE"},{"image":"http://static.binance.org/icon/ef164f57243f4b3e8a48f62fb5727c8e","symbol":"CAN-677","name":"CanYaCoin"},{"image":"http://static.binance.org/icon/45017ebd4c594b88b1cb0525b2327021","symbol":"NOW-E68","name":"NOW Token"},{"image":"http://static.binance.org/icon/fda3401194444c1b9217fb402eddb4b2","symbol":"EQL-586","name":"EQUAL"},{"image":"http://static.binance.org/icon/7a361c3488af4a0c95841527fd4c2710","symbol":"GIV-94E","name":"Givly Coin"},{"image":"http://static.binance.org/icon/663206ec1652484184d291cdea28f4df","symbol":"WISH-2D5","name":"MyWish"},{"image":"http://static.binance.org/icon/018a239c432444c78dfa4e2c7e92a015","symbol":"EBST-783","name":"eBoost"},{"image":null,"symbol":"QBX-38C","name":"qiibeeToken"},{"image":null,"symbol":"ARPA-575","name":"ARPA"},{"image":"http://static.binance.org/icon/9183317febff4c7baef522af042c311d","symbol":"XNS-760","name":"Xeonbit Token"},{"image":"http://static.binance.org/icon/a61ea7672257445d92130da916ad0b0c","symbol":"OWTX-A6B","name":"OpenWeb Token"},{"image":"http://static.binance.org/icon/c91f7ba4affe4f9ebc8e1acbf87b108d","symbol":"GTEX-71B","name":"GTEX"},{"image":"http://static.binance.org/icon/51cc0f3b8d6c45b78f2779d479f7822c","symbol":"EET-45C","name":"Energy Eco Token"},{"image":"http://static.binance.org/icon/11fcbd9bda1345849f929d935bdec720","symbol":"BAW-DFB","name":"BAWnetwork"},{"image":"http://static.binance.org/icon/84a789daa8e54f2698699feab21fdd71","symbol":"BGBP-CF3","name":"Binance GBP Stable Coin"},{"image":"http://static.binance.org/icon/29037846e4cd44488ca10f6a31f64698","symbol":"NODE-F3A","name":"NODE"},{"image":"http://static.binance.org/icon/dab4143d15da42da9ea20bb698de9198","symbol":"BHFT-BBE","name":"Humanity First Token"},{"image":"http://static.binance.org/icon/5da1b510979f4455868f0393547875e9","symbol":"USDH-5B5","name":"HonestCoin"},{"image":null,"symbol":"MCC-33B","name":"Magic Cube Token"},{"image":"http://static.binance.org/icon/c7fc4f71878a4a5b978fb39252087a4b","symbol":"ALA-DCD","name":"Alaris"},{"image":null,"symbol":"TM2-0C4","name":"Traxia 2"},{"image":"http://static.binance.org/icon/26203e4fdecd496baadddb3489e473f7","symbol":"BETX-A0C","name":"BETX Token"},{"image":"http://static.binance.org/icon/225f7a276a6d4b65ab793cff99632012","symbol":"DEFI-FA5","name":"DeFi Token"},{"image":null,"symbol":"CBM-4B2","name":"CryptoBonusMiles"},{"image":"http://static.binance.org/icon/76675f57a4ac46d1ad74d06f2d626ec5","symbol":"PCAT-4BB","name":"Pink Care Token"},{"image":null,"symbol":"TED-A85","name":"TrustED Token"},{"image":null,"symbol":"MVL-7B0","name":"Mass Vehicle Ledger"},{"image":null,"symbol":"MTXLT-286","name":"Tixl"},{"image":null,"symbol":"LOKI-6A9","name":"Loki"},{"image":null,"symbol":"STIPS-14F","name":"STIPS Token"},{"image":null,"symbol":"UPX-F3E","name":"UPX"},{"image":null,"symbol":"BET-844","name":"EOSBet Token"},{"image":null,"symbol":"IKU-416","name":"IKU"},{"image":null,"symbol":"ECO-083","name":"Ormeus Ecosystem"},{"image":null,"symbol":"PYN-C37","name":"paycentos"},{"image":null,"symbol":"MBL-2D2","name":"Moviebloc"},{"image":null,"symbol":"ART-3C9","name":"Maecenas ART Token"},{"image":null,"symbol":"VOTE-FD4","name":"Vote"},{"image":null,"symbol":"ZEBI-84F","name":"ZEBI"},{"image":null,"symbol":"RNA-23B","name":"Reporter News Agency Token"},{"image":null,"symbol":"XBASE-CD2","name":"Eterbase Coin"},{"image":null,"symbol":"MFGB-0A0","name":"SyncFab Smart Manufacturing"},{"image":"http://static.binance.org/icon/261da535601c47dfadc9cdf86a805740","symbol":"TUSDB-888","name":"TrueUSD"},{"image":"http://static.binance.org/icon/7b162ac07b6b49d5ab9e9ff521c7a1f2","symbol":"TAUDB-888","name":"TrueAUD"},{"image":"http://static.binance.org/icon/b43ec28e30f945b5a335abf1c92b896a","symbol":"TCADB-888","name":"TrueCAD"},{"image":"http://static.binance.org/icon/8d229cd93254487c988ed4df8a2c444f","symbol":"TGBPB-888","name":"TrueGBP"},{"image":"http://static.binance.org/icon/f780f9da5c4942ecb8dd0475fb3c0544","symbol":"THKDB-888","name":"TrueHKD"},{"image":null,"symbol":"SWIPE.B-DC0","name":"SWIPE Token"},{"image":null,"symbol":"BST2-2F2","name":"BOOSTO"},{"image":null,"symbol":"MATIC-84A","name":"Matic Token"},{"image":null,"symbol":"MTV-4C6","name":"MultiVAC"},{"image":null,"symbol":"SLV-986","name":"Silverway"},{"image":null,"symbol":"EVT-49B","name":"everiToken"},{"image":null,"symbol":"ONTB-9D4","name":"Ontology"},{"image":null,"symbol":"NPXSXEM-E7A","name":"NPXSXEM"},{"image":null,"symbol":"ATP-38C","name":"Atlas Protocol"},{"image":null,"symbol":"UUU-35C","name":"UNetwork Token"},{"image":null,"symbol":"SPIN-9DD","name":"SPIN Protocol"},{"image":null,"symbol":"LAMB-46C","name":"Lambda"},{"image":null,"symbol":"NPXSXEM-89C","name":"Pundi X NEM"},{"image":"http://static.binance.org/icon/4e8c9ed99f9944228363c3be7abee8ae","symbol":"TRXB-2E6","name":"TRXB"},{"image":"http://static.binance.org/icon/46aedb600ffb47fc982471cd49200a86","symbol":"BTTB-D31","name":"BTTB"},{"image":null,"symbol":"AERGO-46B","name":"Aergo"},{"image":null,"symbol":"CUSD-24B","name":"Carbon Dollar"},{"image":null,"symbol":"BPRO-5A6","name":"Bitcloud Pro"},{"image":null,"symbol":"CCCX-10D","name":"Clipper Coin"},{"image":"http://static.binance.org/icon/b417be27571b4dc4922457abf99b6627","symbol":"NEXO-A84","name":"Nexo"},{"image":null,"symbol":"VDX-A17","name":"Vodi X"},{"image":null,"symbol":"FOR-997","name":"The Force Token"}]';

@Component({
    selector: 'app-all-balances',
    templateUrl: './all-balances.component.html',
    styleUrls: ['./all-balances.component.css'],
})
export class AllBalancesComponent implements OnInit {


    balances$: Observable<any>;


    constructor(private bncService: BinanceService, private storage: StorageService, private location: Location, private http: HttpClient) {

    }

    goBack() {
        this.location.back();
    }

    ngOnInit() {

        const timer$ = timer(0, 4000);

        const balances$ = timer$.pipe(
            switchMap(() => {
                return this.bncService.getBalance('bnb1jxfh2g85q3v0tdq56fnevx6xcxtcnhtsmcu64m', ' https://dex.binance.org/');
            }),
            map((resp: any) => {
                return resp.balances
            })
        );

        const bnb2usdRate$ = timer(0, 60000).pipe(
            switchMap(() => {
                return this.http.get('https://min-api.cryptocompare.com/data/price?fsym=BNB&tsyms=USD');
            }),
            map((resp: any) => resp.USD)
        );

        const marketRates$ = timer$.pipe(
            switchMap(() => {
                return this.http.get('https://dex.binance.org/api/v1/ticker/24hr');
            }),
            map((resp: any) => resp)
        );

        // const tokensImages$ = timer$.pipe(
        //     switchMap(() => {
        //         return this.http.get('https://explorer.binance.org/api/v1/assets?page=1&rows=3500')
        //     }),
        //     map((resp: any) => {
        //         return resp.assetInfoList;
        //     })
        // )


        this.balances$ = combineLatest([balances$, marketRates$, bnb2usdRate$])
            .pipe(
                map((x: any[]) => {
                    const [balances, marketRates, bnb2usd] = x;
                    let array = [];
                    balances.forEach((balanceI) => {
                        if (balanceI.symbol !== 'BNB') {
                            array.push({
                                'sum': Number(balanceI.free),
                                'symbol': balanceI.symbol
                            })
                        }

                    });
                    let arrayOfRates = [];
                    marketRates.forEach((tokenPair) => {
                        if (tokenPair.symbol !== 'BNB') {
                            arrayOfRates.push({
                                'symbol': tokenPair.baseAssetName,
                                'rate': Number(tokenPair.lastPrice) * bnb2usd,
                            })
                        }
                    });
                    let imagesUrls = JSON.parse(rawTokensImg);

                    let d = [];
                    array.forEach((x) => {
                        let bObj = arrayOfRates.find(o => o.symbol === x.symbol);
                        let tObj = imagesUrls.find(o => o.symbol === x.symbol);
                        if (bObj !== undefined && tObj !== undefined) {
                            d.push({
                                'symbol': x.symbol,
                                'balance2usd': bObj.rate * x.sum,
                                'balance': x.sum,
                                'image': tObj.image,
                                'name': tObj.name,
                            });
                        }

                    });
                    return d.sort((a, b) => parseFloat(a.balance) - parseFloat(b.balance));
                }));


    }
}