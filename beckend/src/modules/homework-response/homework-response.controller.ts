import { Controller, Post, Body, UploadedFile, UseInterceptors, Req, UseGuards, Get, Param, ParseIntPipe } from "@nestjs/common";
import { HomeworkResponseService } from "./homework-response.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import path from "path";
import { AuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/role-guard";
import { Roles } from "src/common/decorator/role";
import { Role } from "@prisma/client";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from "@nestjs/swagger";
import { CreateHomeworkResponseDto } from "./dto/create-homework-response.dto";

@Controller("homework-response")
@ApiBearerAuth()
export class HomeworkResponseController {

  constructor(private service: HomeworkResponseService) {}

  @ApiOperation({ summary: `${Role.STUDENT}, ${Role.ADMIN}, ${Role.SUPERADMIN}` })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.STUDENT, Role.ADMIN, Role.SUPERADMIN)

  @ApiConsumes('multipart/form-data')

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        homeworkId: { type: 'number' },
        studentId: { type: 'number' },
        title: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
          nullable: true
        }
      }
    }
  })
  @UseInterceptors(FileInterceptor("file", {
    storage: diskStorage({
      destination: "./uploads/homework-response",
      filename: (req, file, cb) => {
        const name = Date.now() + path.extname(file.originalname);
        cb(null, name);
      }
    })
  }))
  @Post()
  createResponse(
    @Body() payload: CreateHomeworkResponseDto,
    @Req() req: Request,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.service.createResponse(payload, req["user"], file?.filename);
  }

   @ApiOperation({ summary: `${Role.SUPERADMIN}, ${Role.ADMIN}, ${Role.STUDENT}` })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Get("homework/:homeworkId")
  getResponses(@Param("homeworkId", ParseIntPipe) homeworkId: number) {
    return this.service.getResponses(homeworkId);
  }
}