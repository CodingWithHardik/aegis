import { Event, User } from "../../../.prisma/client";

export const getEvents = async (isAdmin: boolean, user: User, getEventByUser: (userId: string) => Event[] | Promise<Event[]>, getEventByAdmin: (userId: string) =>  Event[] | Promise<Event[]> ): Promise<Event[]> => {
    if (isAdmin) {
        const data = await getEventByAdmin(user.id)
        return data;
    } else {
        const data = await getEventByUser(user.id)
        return data;
    }
}

export const filterEvent = (events: Event[], eventId: string | undefined, year: number | undefined, type: "INTRA" | "MAIN" | undefined): Event[] => {
    if (!eventId && !year && !type) return events;

    if (eventId) {
        return events.filter((event) => event.id === eventId);
    }

    return events.filter((event) => event.year === year && event.type === type);
}