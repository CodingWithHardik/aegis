import { RegisterRepository } from "./register.repository";
import { RegisterService } from "./register.servic";

const registerRepository = new RegisterRepository();
const registerService = new RegisterService(registerRepository)

export { registerService }