import { CommitteeRepository } from "./committee.repository";
import { CommitteeService } from "./committee.service";

const committeeRepository = new CommitteeRepository();
const committeeService = new CommitteeService(committeeRepository)

export { committeeService }