export type RawBinanceStreamCandlestick = {
    e: string // 'kline' Event type
    E: number // 123456789 Event time
    s: string // 'BNBBTC' Symbol
    k: {
        t: number // 123400000 Kline start time
        T: number // 123460000 Kline close time
        s: string // 'BNBBTC' Symbol
        i: string // '1m' Interval
        f: number // 100 First trade ID
        L: number // 200 Last trade ID
        o: string // '0.0010' Open price
        c: string // '0.0020' Close price
        h: string // '0.0025' High price
        l: string // '0.0015' Low price
        v: string // '1000' Base asset volume
        n: number // 100 Number of trades
        x: boolean // false Is this kline closed?
        q: string // '1.0000' Quote asset volume
        V: string // '500' Taker buy base asset volume
        Q: string // '0.500' Taker buy quote asset volume
        B: string // '123456' Ignore
    }
}
