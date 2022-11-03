import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { NotAuthorizedError, RecordAlreadyExistsError, RecordNotFoundError, VerificationError } from '../errors';


export class BaseExceptionFilter<T extends Error> implements ExceptionFilter<T> {

  constructor(private status: HttpStatus) {}

  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    response
      .status(this.status)
      .json({
        statusCode: this.status,
        error: exception.name,
        message: exception.message,
      });
  }
}

@Catch(RecordAlreadyExistsError, VerificationError)
export class RecordAlreadyExistsExceptionFilter extends BaseExceptionFilter<RecordAlreadyExistsError> {
  constructor() {
    super(HttpStatus.BAD_REQUEST);
  }
}

@Catch(RecordNotFoundError)
export class RecordNotFoundExceptionFilter extends BaseExceptionFilter<RecordNotFoundError> {
    constructor() {
        super(HttpStatus.NOT_FOUND);
    }
}

@Catch(NotAuthorizedError)
export class NotAuthorizedExceptionFilter extends BaseExceptionFilter<NotAuthorizedError> {
    constructor() {
        super(HttpStatus.FORBIDDEN);
    }
}

@Catch(VerificationError)
export class VerificationExceptionFilter extends BaseExceptionFilter<VerificationError> {
    constructor() {
        super(HttpStatus.BAD_REQUEST);
    }
}