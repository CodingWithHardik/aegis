import { EventResponseType } from "./event.types";

export const toEventResponse = (event: EventResponseType) => {
    return {
        id: event.id,
        year: event.year,
        type: event.type,
        name: event.name,
        ...(event.about !== null ? { about: event.about } : {}),
        startDate: event.startDate,
        endDate: event.endDate,
    }
}

export const toEventDeleteResponse = (event: EventResponseType) => {
    return {
        id: event.id
    }
}