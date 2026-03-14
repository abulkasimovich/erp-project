import { CreateHomeworkResponseDto } from './dto/create-homework-response.dto';
import { UpdateHomeworkResponseDto } from './dto/update-homework-response.dto';
export declare class HomeworkResponseService {
    create(createHomeworkResponseDto: CreateHomeworkResponseDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateHomeworkResponseDto: UpdateHomeworkResponseDto): string;
    remove(id: number): string;
}
