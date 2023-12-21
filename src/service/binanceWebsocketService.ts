import { ErrorEvent, WebSocket } from 'ws'
import { RawBinanceStreamCandlestick } from '../types/binanceType'
import { Candlestick } from '../types/candlestickType'
import { mapRawBinanceStreamCandlestickToCandlestick } from '../mappers/binanceMappers'

class BinanceWebsocketService {
    private static BINANCE_FEATURES_WS_STREAM_URL = 'wss://fstream.binance.com'

    protected maxConnectionCheckAttempts: number
    protected connectionCheckInterval: number
    protected websocketClient: WebSocket | undefined

    constructor(maxConnectionCheckAttempts: number = 20, connectionCheckInterval: number = 200) {
        this.maxConnectionCheckAttempts = maxConnectionCheckAttempts
        this.connectionCheckInterval = connectionCheckInterval
    }

    public async connect(): Promise<void> {
        this.websocketClient = new WebSocket(`${BinanceWebsocketService.BINANCE_FEATURES_WS_STREAM_URL}/ws`)

        this.websocketClient.on('open', this.onOpenHandler)
        this.websocketClient.on('close', this.onCloseHandler)
        this.websocketClient.on('error', this.onErrorHandler)
        this.websocketClient.on('message', this.onMessageHandler)

        return this.waitForOpenConnection()
    }

    public subscribeToKlineStream(symbol: string, timeframe: string): void {
        this.websocketClient?.send(this.subscriptionTemplate('SUBSCRIBE', symbol, 'kline', timeframe))
    }

    public unsubscribeFromKlineStream(symbol: string, timeframe: string): void {
        this.websocketClient?.send(this.subscriptionTemplate('UNSUBSCRIBE', symbol, 'kline', timeframe))
    }

    protected onOpenHandler(): void {
        console.log(`Connection established for: ${BinanceWebsocketService.BINANCE_FEATURES_WS_STREAM_URL}`)
    }

    protected onCloseHandler(code: number, reason: string): void {
        console.log(`Connection closed, code: ${code}, reason: ${reason}`)
    }

    protected onErrorHandler(error: ErrorEvent): void {
        console.log(`Error occured, error: ${error.error}, message: ${error.message}`)
    }

    protected onMessageHandler(rawData: string): void {
        const parsedData = JSON.parse(rawData)

        if (parsedData.k) {
            const rawCandlestick = parsedData as RawBinanceStreamCandlestick
            const candlestick: Candlestick = mapRawBinanceStreamCandlestickToCandlestick(rawCandlestick)
            console.log(candlestick)
        }
    }

    private subscriptionTemplate(method: string, symbol: string, stream: string, timeframe?: string) {
        return `{
            "method": "${method}",
            "params": [
                "${symbol}@${stream}${timeframe ? '_' + timeframe : ''}"
            ],
            "id": 1
        }`
    }

    private waitForOpenConnection(): Promise<void> {
        return new Promise((resolve, reject) => {
            let currentAttempt = 0
            const interval = setInterval(() => {
                if (currentAttempt > this.maxConnectionCheckAttempts) {
                    clearInterval(interval)
                    reject(new Error('Maximum number of attempts exceeded'))
                } else if (this.websocketClient && this.websocketClient.readyState === this.websocketClient.OPEN) {
                    clearInterval(interval)
                    resolve()
                }
                currentAttempt++
            }, this.connectionCheckInterval)
        })
    }
}

export default BinanceWebsocketService
