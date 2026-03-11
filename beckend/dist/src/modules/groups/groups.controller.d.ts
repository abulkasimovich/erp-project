import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create.group.dto';
export declare class GroupsController {
    private readonly groupService;
    constructor(groupService: GroupsService);
    getGroupLessons(groupId: number, req: Request): Promise<{
        success: boolean;
        data: {
            title: string;
            id: number;
            created_at: Date;
            updated_at: Date;
            groupId: number;
            userId: number | null;
            teacherId: number | null;
        }[];
    }>;
    getAllGroup(): Promise<{
        success: boolean;
        data: {
            id: number;
            status: import("@prisma/client").$Enums.UserStatus;
            created_at: Date;
            updated_at: Date;
            name: string;
            capacity: number;
            userId: number;
            teacherId: number;
            roomId: number;
            courseId: number;
            startDate: Date;
            startTime: string;
            weekDays: import("@prisma/client").$Enums.WeekDays[];
        }[];
    }>;
    createGroup(payload: CreateGroupDto, req: Request): Promise<{
        success: boolean;
        message: string;
    }>;
}
