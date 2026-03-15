"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeworkResponseService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let HomeworkResponseService = class HomeworkResponseService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createResponse(payload, currentUser, filename) {
        const existHomework = await this.prisma.homework.findUnique({
            where: { id: Number(payload.homeworkId) }
        });
        if (!existHomework) {
            throw new common_1.NotFoundException("Homework not found");
        }
        const student = await this.prisma.student.findUnique({
            where: {
                id: payload.studentId
            }
        });
        if (!student) {
            throw new common_1.NotFoundException("Student topilmadi");
        }
        await this.prisma.homeworkResponse.create({
            data: {
                homeworkId: payload.homeworkId,
                studentId: student.id,
                title: payload.title,
                file: filename || null,
                status: "COMPLETED"
            }
        });
        return {
            success: true,
            message: "Homework response yuborildi"
        };
    }
    async getResponses(homeworkId) {
        const responses = await this.prisma.homeworkResponse.findMany({
            where: { homeworkId },
            include: {
                student: true
            }
        });
        return {
            success: true,
            data: responses
        };
    }
};
exports.HomeworkResponseService = HomeworkResponseService;
exports.HomeworkResponseService = HomeworkResponseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HomeworkResponseService);
//# sourceMappingURL=homework-response.service.js.map