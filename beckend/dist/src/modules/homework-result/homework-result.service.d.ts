import { PrismaService } from "src/database/prisma.service";
import { Role } from "@prisma/client";
export declare class HomeworkResultService {
    private prisma;
    constructor(prisma: PrismaService);
    giveScore(payload: any, currentUser: {
        id: number;
        role: Role;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    getResults(homeworkId: number): Promise<{
        success: boolean;
        data: ({
            student: {
                fullName: string;
                email: string;
                password: string;
                id: number;
                photo: string | null;
                status: import("@prisma/client").$Enums.UserStatus;
                created_at: Date;
                updated_at: Date;
                birth_date: Date;
            };
        } & {
            id: number;
            status: import("@prisma/client").$Enums.HomeworkStatus;
            created_at: Date;
            updated_at: Date;
            title: string;
            teacherId: number | null;
            userId: number | null;
            studentId: number;
            file: string | null;
            homeworkId: number;
            score: number;
        })[];
    }>;
}
