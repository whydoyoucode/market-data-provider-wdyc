import { mapRawBinanceRestApiCandlestickToCandlestick } from '../mappers/binanceMappers'
import { Candlestick } from '../types/candlestickType'

class BinanceRestApiService {
    public static BINANCE_EXCHANGE_NAME = 'binance'
    private static BINANCE_FUTURES_API_BASE_URL = 'https://fapi.binance.com'

    public async getExchangeLastCandlesticks(
        symbol: string,
        timeframe: string,
        amount: number,
    ): Promise<Candlestick[]> {
        const response = await fetch(
            `${BinanceRestApiService.BINANCE_FUTURES_API_BASE_URL}/fapi/v1/klines?symbol=${symbol}&interval=${timeframe}&limit=${amount}`,
        )

        const data = await response.json()
        const result: Candlestick[] = Array.isArray(data)
            ? data.map(klineArr => mapRawBinanceRestApiCandlestickToCandlestick(symbol, timeframe, klineArr))
            : []

        return Promise.resolve(result)
    }
}

export default BinanceRestApiService
