import { HttpService, Injectable, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface News {
    readonly datetime: string;
    readonly headline: string;
    readonly source: string;
    readonly url: string;
    readonly summary: string;
    readonly related: string;
    readonly image: string;
}

@Injectable()
export class ExampleHttpService {
    constructor(
        private readonly httpService: HttpService,
        private readonly logger: Logger,
    ) { }

    getTickerNews(ticker: string, num: number = 5): Observable<News[]> {
        return this.httpService
            .get(`https://api.iextrading.com/1.0/stock/${ticker}/news/last/${num}`)
            .pipe(map(response => response.data));
    }
}
