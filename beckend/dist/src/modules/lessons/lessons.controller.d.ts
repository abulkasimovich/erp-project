import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
export declare class LessonsController {
    private readonly lessonServise;
    constructor(lessonServise: LessonsService);
    getLessonById(groupId: number): Promise<{
        success: boolean;
        data: {
            id: number;
            title: string;
        }[];
    }>;
    createStudentGroup(payload: CreateLessonDto, req: Request): Promise<{
        success: boolean;
        message: string;
    }>;
}
