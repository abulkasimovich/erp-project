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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeworkResultController = void 0;
const common_1 = require("@nestjs/common");
const homework_result_service_1 = require("./homework-result.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const role_guard_1 = require("../../common/guards/role-guard");
const role_1 = require("../../common/decorator/role");
const client_1 = require("@prisma/client");
const swagger_1 = require("@nestjs/swagger");
let HomeworkResultController = class HomeworkResultController {
    service;
    constructor(service) {
        this.service = service;
    }
    giveScore(payload, req) {
        return this.service.giveScore(payload, req["user"]);
    }
    getResults(homeworkId) {
        return this.service.getResults(homeworkId);
    }
};
exports.HomeworkResultController = HomeworkResultController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `${client_1.Role.TEACHER}, ${client_1.Role.ADMIN}, ${client_1.Role.SUPERADMIN}` }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthGuard, role_guard_1.RolesGuard),
    (0, role_1.Roles)(client_1.Role.TEACHER, client_1.Role.ADMIN, client_1.Role.SUPERADMIN),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                responseId: { type: 'number' },
                title: { type: 'string' },
                score: { type: 'number' }
            }
        }
    }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Request]),
    __metadata("design:returntype", void 0)
], HomeworkResultController.prototype, "giveScore", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `${client_1.Role.SUPERADMIN}, ${client_1.Role.ADMIN}, ${client_1.Role.TEACHER}` }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthGuard, role_guard_1.RolesGuard),
    (0, role_1.Roles)(client_1.Role.SUPERADMIN, client_1.Role.ADMIN),
    (0, common_1.Get)("homework/:homeworkId"),
    __param(0, (0, common_1.Param)("homeworkId", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], HomeworkResultController.prototype, "getResults", null);
exports.HomeworkResultController = HomeworkResultController = __decorate([
    (0, common_1.Controller)("homework-result"),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [homework_result_service_1.HomeworkResultService])
], HomeworkResultController);
//# sourceMappingURL=homework-result.controller.js.map