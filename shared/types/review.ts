export enum ReviewGrade {
    Blackout = 0, Incorrect = 1, Hard = 2, Passable = 3, Good = 4, Perfect = 5
}

export interface ProgressRecord {
    cardId: string,
    intervalDays: number,
    easeFactor: number,
    repetitionCount: number,
    nextReviewAt: number
}

export interface ProgressRepository {
    getRecord(userId: string, cardId: string): Promise<ProgressRecord | null>;
    getRecordsByCardIds(userId: string, cardIds: string[]): Promise<ProgressRecord[]>;
    saveRecord(userId: string, cardId: string): Promise<void>;
}