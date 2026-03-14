import { Injectable } from '@nestjs/common';
import { CreateHomeworkResponseDto } from './dto/create-homework-response.dto';
import { UpdateHomeworkResponseDto } from './dto/update-homework-response.dto';

@Injectable()
export class HomeworkResponseService {
  create(createHomeworkResponseDto: CreateHomeworkResponseDto) {
    return 'This action adds a new homeworkResponse';
  }

  findAll() {
    return `This action returns all homeworkResponse`;
  }

  findOne(id: number) {
    return `This action returns a #${id} homeworkResponse`;
  }

  update(id: number, updateHomeworkResponseDto: UpdateHomeworkResponseDto) {
    return `This action updates a #${id} homeworkResponse`;
  }

  remove(id: number) {
    return `This action removes a #${id} homeworkResponse`;
  }
}
