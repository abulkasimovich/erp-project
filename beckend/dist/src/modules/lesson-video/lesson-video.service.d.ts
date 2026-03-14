import { CreateLessonVideoDto } from './dto/create-lesson-video.dto';
import { PrismaService } from 'src/database/prisma.service';
import { Role } from '@prisma/client';
export declare class LessonVideoService {
    private prisma;
    constructor(prisma: PrismaService);
    getLessonVideoByGroupId(groupId: number, currentUser: {
        id: number;
        role: Role;
    }): Promise<{
        success: boolean;
        data: {
            lesson: {
                title: string;
            };
            id: number;
            file: string;
        }[];
    }>;
    createLessonVideos(payload: CreateLessonVideoDto, currentUser: {
        id: number;
        role: Role;
    }, filename: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
