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
exports.HomeworkResponseController = void 0;
const common_1 = require("@nestjs/common");
const homework_response_service_1 = require("./homework-response.service");
const create_homework_response_dto_1 = require("./dto/create-homework-response.dto");
const update_homework_response_dto_1 = require("./dto/update-homework-response.dto");
let HomeworkResponseController = class HomeworkResponseController {
    homeworkResponseService;
    constructor(homeworkResponseService) {
        this.homeworkResponseService = homeworkResponseService;
    }
    create(createHomeworkResponseDto) {
        return this.homeworkResponseService.create(createHomeworkResponseDto);
    }
    findAll() {
        return this.homeworkResponseService.findAll();
    }
    findOne(id) {
        return this.homeworkResponseService.findOne(+id);
    }
    update(id, updateHomeworkResponseDto) {
        return this.homeworkResponseService.update(+id, updateHomeworkResponseDto);
    }
    remove(id) {
        return this.homeworkResponseService.remove(+id);
    }
};
exports.HomeworkResponseController = HomeworkResponseController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_homework_response_dto_1.CreateHomeworkResponseDto]),
    __metadata("design:returntype", void 0)
], HomeworkResponseController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HomeworkResponseController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HomeworkResponseController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_homework_response_dto_1.UpdateHomeworkResponseDto]),
    __metadata("design:returntype", void 0)
], HomeworkResponseController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HomeworkResponseController.prototype, "remove", null);
exports.HomeworkResponseController = HomeworkResponseController = __decorate([
    (0, common_1.Controller)('homework-response'),
    __metadata("design:paramtypes", [homework_response_service_1.HomeworkResponseService])
], HomeworkResponseController);
//# sourceMappingURL=homework-response.controller.js.map