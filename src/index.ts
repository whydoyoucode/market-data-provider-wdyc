import BinanceWebsocketService from './service/binanceWebsocketService'
import events from 'events'
import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import EventDispatcher from './service/eventDispatcher'
import BinanceRestApiService from './service/binanceRestApiService'
import { Candlestick } from './types/candlestickType'

const start = async () => {
    const emitter = new events.EventEmitter()
    const eventDispatcher = new EventDispatcher(emitter)
    const binanceWebsocketService: BinanceWebsocketService = new BinanceWebsocketService(eventDispatcher)
    await binanceWebsocketService.connect()

    const binanceRestApiService: BinanceRestApiService = new BinanceRestApiService()

    const app: Express = express()
    const defaultPort = process.env.PORT || 3000
    app.use(cors())
    app.use(express.json())

    app.get('/stream/candlestick/subscribe', (req: Request, res: Response) => {
        res.writeHead(200, {
            Connection: 'keep-alive',
            'Content-Type': 'text/event-stream',
            'Cache-control': 'no-cache',
        })

        const eventState = req.query['eventState']
        const subscriberId = req.query['subscriberId']

        emitter.on(`candlestick_${eventState}_${subscriberId}`, message => {
            res.write(`data: ${JSON.stringify(message)} '\n\n`)
        })
    })

    app.post('/stream/candlestick/subscribe', async (req: Request, res: Response) => {
        const symbol = req.body['symbol']
        const timeframe = req.body['timeframe']
        const exchange = req.body['exchange']
        const state = req.body['state']
        const subscriberId = req.body['subscriberId']

        binanceWebsocketService.subscribeToKlineStream(symbol, timeframe)

        eventDispatcher.subscribe(subscriberId, {
            symbol,
            timeframe,
            exchange,
            state,
        })

        res.sendStatus(200)
    })

    app.get('/data/candlestick/limited', async (req: Request, res: Response) => {
        const symbol = req.query['symbol'] as string
        const timeframe = req.query['timeframe'] as string
        const amount = Number.parseInt(req.query['amount'] as string)

        const candlesticks: Candlestick[] = await binanceRestApiService.getExchangeLastCandlesticks(
            symbol,
            timeframe,
            amount,
        )

        res.json(candlesticks)
    })

    app.listen(defaultPort, () => {
        console.log(`Server is running at http://localhost:${defaultPort}`)
    })
}

start()
