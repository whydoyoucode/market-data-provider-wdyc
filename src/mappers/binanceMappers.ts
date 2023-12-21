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
