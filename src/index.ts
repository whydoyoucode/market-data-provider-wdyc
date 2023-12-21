import BinanceWebsocketService from './service/binanceWebsocketService'

const timeout = (ms: number): Promise<void> => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            res()
        }, ms)
    })
}

const start = async () => {
    const binanceWebsocketService: BinanceWebsocketService = new BinanceWebsocketService()

    await binanceWebsocketService.connect()
    binanceWebsocketService.subscribeToKlineStream('btcusdt', '5m')
    binanceWebsocketService.subscribeToKlineStream('ethusdt', '1m')
    await timeout(5000)
    binanceWebsocketService.unsubscribeFromKlineStream('btcusdt', '5m')
    await timeout(3000)
    binanceWebsocketService.unsubscribeFromKlineStream('ethusdt', '1m')
}

start()
