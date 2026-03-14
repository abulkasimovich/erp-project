import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HomeworkResponseService } from './homework-response.service';
import { CreateHomeworkResponseDto } from './dto/create-homework-response.dto';
import { UpdateHomeworkResponseDto } from './dto/update-homework-response.dto';


@Controller('homework-response')
export class HomeworkResponseController {
  constructor(private readonly homeworkResponseService: HomeworkResponseService) {}

  @Post()
  create(@Body() createHomeworkResponseDto: CreateHomeworkResponseDto) {
    return this.homeworkResponseService.create(createHomeworkResponseDto);
  }

  @Get()
  findAll() {
    return this.homeworkResponseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.homeworkResponseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHomeworkResponseDto: UpdateHomeworkResponseDto) {
    return this.homeworkResponseService.update(+id, updateHomeworkResponseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.homeworkResponseService.remove(+id);
  }
}
