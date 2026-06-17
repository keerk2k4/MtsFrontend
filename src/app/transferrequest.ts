export interface Transferrequest {
    fromId: number;
    toId: number;
    amount: number;
    idempotencyKey?: string;
}
