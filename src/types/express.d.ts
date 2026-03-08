import { PayloadDto } from '../modules/auth/dto/jwt-payload.dto';

declare global {
  namespace Express {
    interface Request {
      user?: PayloadDto;
    }
  }
}
