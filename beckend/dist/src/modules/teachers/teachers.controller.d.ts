import { TeachersService } from './teachers.service';
import { UpdateTeacherDto } from './dto/update.teacher.dto';
import { CreateTeacherDto } from './dto/create.teacher.dto';
export declare class TeachersController {
    private readonly teachersService;
    constructor(teachersService: TeachersService);
    createTeacher(payload: CreateTeacherDto, file: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
    }>;
    getAllTeacher(): Promise<{
        success: boolean;
        data: {
            password: string;
            email: string;
            fullName: string;
            position: string;
            photo: string | null;
            id: number;
            status: import("@prisma/client").$Enums.UserStatus;
            created_at: Date;
            updated_at: Date;
            experience: number;
        }[];
    }>;
    getOneTeacher(id: string): Promise<{
        success: boolean;
        data: {
            password: string;
            email: string;
            fullName: string;
            position: string;
            photo: string | null;
            id: number;
            status: import("@prisma/client").$Enums.UserStatus;
            created_at: Date;
            updated_at: Date;
            experience: number;
        };
    }>;
    updateTeacher(id: string, payload: UpdateTeacherDto): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteTeacher(id: string): void;
}
