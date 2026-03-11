import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
export declare class StudentsController {
    private readonly studentsService;
    constructor(studentsService: StudentsService);
    createStudent(payload: CreateStudentDto, file: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
    }>;
    getAllStudent(): Promise<{
        success: boolean;
        data: {
            password: string;
            email: string;
            fullName: string;
            photo: string | null;
            id: number;
            status: import("@prisma/client").$Enums.UserStatus;
            created_at: Date;
            updated_at: Date;
            birth_date: Date;
        }[];
    }>;
    getOneStudent(id: string): Promise<{
        success: boolean;
        data: {
            password: string;
            email: string;
            fullName: string;
            photo: string | null;
            id: number;
            status: import("@prisma/client").$Enums.UserStatus;
            created_at: Date;
            updated_at: Date;
            birth_date: Date;
        };
    }>;
}
