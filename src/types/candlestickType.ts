export type Candlestick = {
    symbol: string
    exchange: string
    timeframe: string
    open: number
    closed: number
    high: number
    low: number
    openTime: number
    closeTime: number
    isClosed: boolean
}

export type CandlestickEventState = 'closed' | 'updated'

export type CandlestickEventType = {
    symbol: string
    timeframe: string
    exchange: string
    state: CandlestickEventState
}