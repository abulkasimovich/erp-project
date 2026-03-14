import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, Req, UploadedFile, ParseIntPipe } from '@nestjs/common';
import { LessonVideoService } from './lesson-video.service';
import { CreateLessonVideoDto } from './dto/create-lesson-video.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';

import { RolesGuard } from 'src/common/guards/role-guard';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorator/role';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path from 'path';
import { Role } from '@prisma/client';
// import { UpdateLessonVideoDto } from './dto/update-lesson-video.dto';

@Controller('lesson-video')
@ApiBearerAuth()
export class LessonVideoController {
  constructor(private readonly lessonVideoService: LessonVideoService) {}

    @ApiOperation({ summary: `${Role.SUPERADMIN}, ${Role.ADMIN}, ${Role.TEACHER}` })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Get(":groupId")
    getLessonVideoByGroupId(
      @Param('groupId', ParseIntPipe) groupId: number,
      @Req()req: Request
    ){
      return this.lessonVideoService.getLessonVideoByGroupId(groupId, req["user"])

    }

    @ApiOperation({ summary: `${Role.SUPERADMIN}, ${Role.ADMIN}, ${Role.TEACHER}` })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          groupId: {type:"number"},
          lessonId: { type: "number" },
          file: { type: "string", format: "binary", nullable: true }
        }
      }
  
    })
    @UseInterceptors(FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/videos',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`
          cb(null, filename)
        }
      })
    }))
  
    @Post()
    createHomework(@Body() payload: CreateLessonVideoDto, @Req() req: Request, @UploadedFile() file: Express.Multer.File) {
      return this.lessonVideoService.createLessonVideos(payload, req["user"], file.filename)
    }

  // @Get()
  // findAll() {
  //   return this.lessonVideoService.findAll();
  // }


//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateLessonVideoDto: UpdateLessonVideoDto) {
//     return this.lessonVideoService.update(+id, updateLessonVideoDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.lessonVideoService.remove(+id);
//   }
}
