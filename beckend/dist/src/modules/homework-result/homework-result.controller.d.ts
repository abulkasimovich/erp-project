import { HomeworkResultService } from './homework-result.service';
import { CreateHomeworkResultDto } from './dto/create-homework-result.dto';
import { UpdateHomeworkResultDto } from './dto/update-homework-result.dto';
export declare class HomeworkResultController {
    private readonly homeworkResultService;
    constructor(homeworkResultService: HomeworkResultService);
    create(createHomeworkResultDto: CreateHomeworkResultDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateHomeworkResultDto: UpdateHomeworkResultDto): string;
    remove(id: string): string;
}
