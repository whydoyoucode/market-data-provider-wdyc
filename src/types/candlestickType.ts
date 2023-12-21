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
