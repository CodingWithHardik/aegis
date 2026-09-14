import { CommitteeResponseType } from "./committee.types";

export const toCommitteeResponse = (committee: CommitteeResponseType) => {
    return {
        id: committee.id,
        name: committee.name,
        slug: committee.slug,
        agenda: committee.agenda,
        ...(committee.about != null && { about: committee.about }),
        capacity: committee.capacity,
        eventId: committee.eventId,
        createdAt: committee.createdAt,
        updatedAt: committee.updatedAt,
    }
}

export const toCommitteeGetResponse = (committee: CommitteeResponseType[]) => {
    return committee.map(( committee ) => toCommitteeResponse(committee))
} 