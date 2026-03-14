import { CreateHomeworkDto } from './dto/create-homework.dto';
import { HomeworksService } from './homework.service';
export declare class HomeworkController {
    private readonly homeworkService;
    constructor(homeworkService: HomeworksService);
    getAllHomeworksByGroup(groupId: number, req: Request): Promise<{
        success: boolean;
        data: {
            id: number;
            title: string;
        }[];
    }>;
    createHomework(payload: CreateHomeworkDto, req: Request, file?: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
    }>;
}
