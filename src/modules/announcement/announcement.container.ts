import { AnnouncementRepository } from "./accouncement.repository";
import { AnnouncementService } from "./announcement.service";

const announcementRepository = new AnnouncementRepository();
const announcementService = new AnnouncementService(announcementRepository);

export { announcementService }