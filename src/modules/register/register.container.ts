import { RegisterRepository } from "./register.repository";
import { RegisterService } from "./register.service";

const registerRepository = new RegisterRepository();
const registerService = new RegisterService(registerRepository)

export { registerService }