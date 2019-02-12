import { LoginRequest } from './loginRequest.model';
import { RegType } from './regType.enum';

export class RegisterRequest extends LoginRequest {

  regtypein = "EMAIL";
  receiveinfo = '';
  tandcagreed = '';

  static json(obj: RegisterRequest): object {
    return Object.assign({}, obj, {
      regtypein: RegType[obj.regtypein]
    });
  }
}
