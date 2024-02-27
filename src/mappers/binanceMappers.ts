import BinanceRestApiService from '../service/binanceRestApiService'
import { RawBinanceStreamCandlestick } from '../types/binanceType'
import { Candlestick } from '../types/candlestickType'

export const mapRawBinanceStreamCandlestickToCandlestick = (
    rawCandlestickData: RawBinanceStreamCandlestick,
): Candlestick => {
    return {
        symbol: rawCandlestickData.s,
        exchange: 'binance',
        timeframe: rawCandlestickData.k.i,
        open: Number.parseFloat(rawCandlestickData.k.o),
        closed: Number.parseFloat(rawCandlestickData.k.c),
        high: Number.parseFloat(rawCandlestickData.k.h),
        low: Number.parseFloat(rawCandlestickData.k.l),
        openTime: rawCandlestickData.k.t,
        closeTime: rawCandlestickData.k.T,
        isClosed: rawCandlestickData.k.x,
    }
}

export const mapRawBinanceRestApiCandlestickToCandlestick = (
    symbol: string,
    timeframe: string,
    klineArr: any[],
): Candlestick => {
    const currentTime = new Date().getTime()
    return {
        symbol,
        timeframe,
        exchange: BinanceRestApiService.BINANCE_EXCHANGE_NAME,
        open: Number.parseFloat(klineArr[1]),
        closed: Number.parseFloat(klineArr[4]),
        high: Number.parseFloat(klineArr[2]),
        low: Number.parseFloat(klineArr[3]),
        openTime: klineArr[0],
        closeTime: klineArr[6],
        isClosed: klineArr[6] < currentTime,
    } as Candlestick
}
