import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class RatingService {

  constructor(private prisma: PrismaService) {}

  async createRating(payload: any) {

    const teacher = await this.prisma.teacher.findUnique({
      where: { id: Number(payload.teacherId) }
    });

    if (!teacher) {
      throw new NotFoundException("Teacher topilmadi");
    }

    await this.prisma.rating.create({
      data: {
        teacherId: payload.teacherId,
        lessonId: payload.lessonId,
        score: payload.score
      }
    });

    return {
      success: true,
      message: "Rating qo'shildi"
    };
  }

  async getRatings(teacherId: number) {

    const ratings = await this.prisma.rating.findMany({
      where: { teacherId },
      include: {
        lesson: true
      }
    });

    return {
      success: true,
      data: ratings
    };
  }
}