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
const create_homework_result_dto_1 = require("./dto/create-homework-result.dto");
const update_homework_result_dto_1 = require("./dto/update-homework-result.dto");
let HomeworkResultController = class HomeworkResultController {
    homeworkResultService;
    constructor(homeworkResultService) {
        this.homeworkResultService = homeworkResultService;
    }
    create(createHomeworkResultDto) {
        return this.homeworkResultService.create(createHomeworkResultDto);
    }
    findAll() {
        return this.homeworkResultService.findAll();
    }
    findOne(id) {
        return this.homeworkResultService.findOne(+id);
    }
    update(id, updateHomeworkResultDto) {
        return this.homeworkResultService.update(+id, updateHomeworkResultDto);
    }
    remove(id) {
        return this.homeworkResultService.remove(+id);
    }
};
exports.HomeworkResultController = HomeworkResultController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_homework_result_dto_1.CreateHomeworkResultDto]),
    __metadata("design:returntype", void 0)
], HomeworkResultController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HomeworkResultController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HomeworkResultController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_homework_result_dto_1.UpdateHomeworkResultDto]),
    __metadata("design:returntype", void 0)
], HomeworkResultController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HomeworkResultController.prototype, "remove", null);
exports.HomeworkResultController = HomeworkResultController = __decorate([
    (0, common_1.Controller)('homework-result'),
    __metadata("design:paramtypes", [homework_result_service_1.HomeworkResultService])
], HomeworkResultController);
//# sourceMappingURL=homework-result.controller.js.map