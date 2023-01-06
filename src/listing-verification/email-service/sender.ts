export interface VerificationSender {
    send<T>(recipient: string, msg: string): Promise<T>;
    logResponse(info: any): string | false;
}