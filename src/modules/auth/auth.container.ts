import { AuthRepository } from "./auth.repository";
import { AuthService } from "./auth.service";

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);

export { authService };