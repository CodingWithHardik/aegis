export type RegisterResponseType = {
    id: string;
    name: string;
    about: string | null;
    role: "BOARD_MEMBER" | "MEMBER";
    portfolio: string | null;
    applicationStatus: "PENDING" | "PROCESSED" | "ALLOTED" | "APPROVED" | "REJECTED" | "REJECTED_PORTFOLIO" | "REJECTED_PAYMENT";
    class: string;
    section: string | null;
    paymentType: "CASH" | "UPI";
    paymentLink: string | null;
    munExperience: number | null;
    munAchievements: string | null;
    additionalInfo: string | null;
    createdAt: Date;
    updatedAt: Date;
}