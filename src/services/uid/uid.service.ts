import { nanoid } from 'nanoid';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UidService {
  generate(length?: number) {
    return nanoid(length);
  }
}
