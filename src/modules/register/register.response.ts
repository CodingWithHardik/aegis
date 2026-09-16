import { RegisterResponseType } from "./register.types";

export const toRegisterResponse = (register: RegisterResponseType) => {
    return {
        id: register.id,
        name: register.name,
        ...(register.about != null && { about: register.about }),
        role: register.role,
        ...(register.portfolio != null && { portfolio: register.portfolio }),
        applicationStatus: register.applicationStatus,
        class: register.class,
        ...(register.section != null && { section: register.section }),
        paymentType: register.paymentType,
        ...(register.paymentLink != null && { paymentLink: register.paymentLink }),
        ...(register.munExperience != null && { munExperience: register.munExperience }),
        ...(register.munAchievements != null && { munAchievements: register.munAchievements }),
        ...(register.additionalInfo != null && { additionalInfo: register.additionalInfo }),
        createdAt: register.createdAt,
        updatedAt: register.updatedAt
    }
}

export const toRegisterGetResponse = (register: RegisterResponseType[]) => {
    return register.map(( register ) => toRegisterResponse(register))
}