import { CreateHomeworkResultDto } from './dto/create-homework-result.dto';
import { UpdateHomeworkResultDto } from './dto/update-homework-result.dto';
export declare class HomeworkResultService {
    create(createHomeworkResultDto: CreateHomeworkResultDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateHomeworkResultDto: UpdateHomeworkResultDto): string;
    remove(id: number): string;
}
