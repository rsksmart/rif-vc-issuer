export class RecordNotFoundError extends Error {
  constructor(message?: string) {
    if (!message) {
      message = 'Record not found';
    }
    super(message);
    this.name = 'RecordNotFound';
  }
}

export class RecordAlreadyExistsError extends Error {
  constructor(message?: string) {
    if (!message) {
      message = 'Record already exists';
    }
    super(message);
    this.name = 'RecordAlreadyExists';
  }
}

export class VerificationError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'VerificationError';
  }
}

export class NotAuthorizedError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'NotAuthorizedError';
  }
}

export class UnexpectedError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'UnexpectedError';
  }
}
