import EventEmitter from 'events'
import { Candlestick, CandlestickEventState, CandlestickEventType } from '../types/candlestickType'

class EventDispatcher {
    private eventMapping: Map<string, CandlestickEventType[]>
    private eventEmitter: EventEmitter

    constructor(eventEmitter: EventEmitter) {
        this.eventEmitter = eventEmitter
        this.eventMapping = new Map()
    }

    public subscribe(subscriberId: string, eventType: CandlestickEventType) {
        if (this.eventMapping.has(subscriberId)) {
            const events = this.eventMapping.get(subscriberId)
            events?.push(eventType)
        } else {
            this.eventMapping.set(subscriberId, [eventType])
        }
    }

    public notify(candlestick: Candlestick, state: CandlestickEventState) {
        const incommingCandlestickEventType = this.candlestickToCandlestickEventType(candlestick, state)

        this.eventMapping.forEach((eventType, subscriberId) => {
            const containsEventType = eventType.filter(type =>
                this.isSameCandlestickEvent(type, incommingCandlestickEventType),
            ).length

            containsEventType && this.eventEmitter.emit(`candlestick_${state}_${subscriberId}`, candlestick)
        })
    }

    private candlestickToCandlestickEventType(
        candlestick: Candlestick,
        state: CandlestickEventState,
    ): CandlestickEventType {
        return {
            symbol: candlestick.symbol,
            exchange: candlestick.exchange,
            timeframe: candlestick.timeframe,
            state: state,
        } as CandlestickEventType
    }

    private isSameCandlestickEvent(left: CandlestickEventType, right: CandlestickEventType): boolean {
        return (
            left.state === right.state &&
            left.exchange === right.exchange &&
            left.symbol === right.symbol &&
            left.timeframe === right.timeframe
        )
    }
}

export default EventDispatcher
