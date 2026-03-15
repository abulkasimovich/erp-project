import { Controller, Post, Body, Req, UseGuards, Get, Param, ParseIntPipe } from "@nestjs/common";
import { HomeworkResultService } from "./homework-result.service";
import { AuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/role-guard";
import { Roles } from "src/common/decorator/role";
import { Role } from "@prisma/client";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from "@nestjs/swagger";

@Controller("homework-result")
@ApiBearerAuth()
export class HomeworkResultController {

  constructor(private service: HomeworkResultService) {}

  @ApiOperation({ summary: `${Role.TEACHER}, ${Role.ADMIN}, ${Role.SUPERADMIN}` })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.TEACHER, Role.ADMIN, Role.SUPERADMIN)
  
    
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        responseId: { type: 'number' },
        title: { type: 'string' },
        score: { type: 'number' }
      }
    }
  })

  @Post()
  giveScore(@Body() payload: any, @Req() req: Request) {
    return this.service.giveScore(payload, req["user"]);
  }

   @ApiOperation({ summary: `${Role.SUPERADMIN}, ${Role.ADMIN}, ${Role.TEACHER}` })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Get("homework/:homeworkId")
  getResults(@Param("homeworkId", ParseIntPipe) homeworkId: number) {
    return this.service.getResults(homeworkId);
  }
}