import { PrismaService } from "src/database/prisma.service";
export declare class RatingService {
    private prisma;
    constructor(prisma: PrismaService);
    createRating(payload: any): Promise<{
        success: boolean;
        message: string;
    }>;
    getRatings(teacherId: number): Promise<{
        success: boolean;
        data: ({
            lesson: {
                id: number;
                created_at: Date;
                updated_at: Date;
                title: string;
                teacherId: number | null;
                userId: number | null;
                groupId: number;
            };
        } & {
            id: number;
            created_at: Date;
            teacherId: number;
            lessonId: number;
            score: number;
        })[];
    }>;
}
