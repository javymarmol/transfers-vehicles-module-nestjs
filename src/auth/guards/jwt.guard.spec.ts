import { JwtGuard } from './jwt.guard';
import 'reflect-metadata';
import { Reflector } from '@nestjs/core';

describe('JwtGuard', () => {
  let reflector: Reflector;
  it('should be defined', () => {
    expect(new JwtGuard(reflector)).toBeDefined();
  });
});
