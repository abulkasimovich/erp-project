import { CreateLessonDto } from './dto/create-lesson.dto';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
export declare class LessonsService {
    private prisma;
    constructor(prisma: PrismaService);
    getLessonById(groupId: number): Promise<{
        success: boolean;
        data: {
            id: number;
            title: string;
        }[];
    }>;
    createLesson(payload: CreateLessonDto, currentUser: {
        id: number;
        role: Role;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
