import { Role } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
export declare class HomeworksService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllHomeworkByGroup(groupId: number, currentUser: {
        id: number;
        role: Role;
    }): Promise<{
        success: boolean;
        data: {
            id: number;
            title: string;
        }[];
    }>;
    createHomework(payload: any, currentUser: {
        id: number;
        role: string;
    }, filename?: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
