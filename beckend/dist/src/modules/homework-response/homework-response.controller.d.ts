import { HomeworkResponseService } from './homework-response.service';
import { CreateHomeworkResponseDto } from './dto/create-homework-response.dto';
import { UpdateHomeworkResponseDto } from './dto/update-homework-response.dto';
export declare class HomeworkResponseController {
    private readonly homeworkResponseService;
    constructor(homeworkResponseService: HomeworkResponseService);
    create(createHomeworkResponseDto: CreateHomeworkResponseDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateHomeworkResponseDto: UpdateHomeworkResponseDto): string;
    remove(id: string): string;
}
