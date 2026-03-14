import { Injectable } from '@nestjs/common';
import { CreateHomeworkResultDto } from './dto/create-homework-result.dto';
import { UpdateHomeworkResultDto } from './dto/update-homework-result.dto';

@Injectable()
export class HomeworkResultService {
  create(createHomeworkResultDto: CreateHomeworkResultDto) {
    return 'This action adds a new homeworkResult';
  }

  findAll() {
    return `This action returns all homeworkResult`;
  }

  findOne(id: number) {
    return `This action returns a #${id} homeworkResult`;
  }

  update(id: number, updateHomeworkResultDto: UpdateHomeworkResultDto) {
    return `This action updates a #${id} homeworkResult`;
  }

  remove(id: number) {
    return `This action removes a #${id} homeworkResult`;
  }
}
