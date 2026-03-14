import { LessonVideoService } from './lesson-video.service';
import { CreateLessonVideoDto } from './dto/create-lesson-video.dto';
export declare class LessonVideoController {
    private readonly lessonVideoService;
    constructor(lessonVideoService: LessonVideoService);
    getLessonVideoByGroupId(groupId: number, req: Request): Promise<{
        success: boolean;
        data: {
            lesson: {
                title: string;
            };
            id: number;
            file: string;
        }[];
    }>;
    createHomework(payload: CreateLessonVideoDto, req: Request, file: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
    }>;
}
