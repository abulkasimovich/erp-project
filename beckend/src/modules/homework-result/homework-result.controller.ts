import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HomeworkResultService } from './homework-result.service';
import { CreateHomeworkResultDto } from './dto/create-homework-result.dto';
import { UpdateHomeworkResultDto } from './dto/update-homework-result.dto';

@Controller('homework-result')
export class HomeworkResultController {
  constructor(private readonly homeworkResultService: HomeworkResultService) {}

  @Post()
  create(@Body() createHomeworkResultDto: CreateHomeworkResultDto) {
    return this.homeworkResultService.create(createHomeworkResultDto);
  }

  @Get()
  findAll() {
    return this.homeworkResultService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.homeworkResultService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHomeworkResultDto: UpdateHomeworkResultDto) {
    return this.homeworkResultService.update(+id, updateHomeworkResultDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.homeworkResultService.remove(+id);
  }
}
