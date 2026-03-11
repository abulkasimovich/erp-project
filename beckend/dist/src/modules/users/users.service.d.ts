import { PrismaService } from 'src/database/prisma.service';
import { CreateUserDto } from './dto/create.user.dto';
import { MailerService } from 'src/common/email/email.service';
import { UpdateUserDto } from './dto/update.user.dto';
export declare class UsersService {
    private prisma;
    private mailerService;
    constructor(prisma: PrismaService, mailerService: MailerService);
    createUser(payload: CreateUserDto, filename: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getAllUsers(): Promise<{
        success: boolean;
        data: {
            id: number;
            fullName: string;
            email: string;
            photo: string | null;
            password: string;
            position: string;
            hire_date: Date;
            role: import("@prisma/client").$Enums.Role;
            address: string | null;
            status: import("@prisma/client").$Enums.UserStatus;
            created_at: Date;
            updated_at: Date;
        }[];
    }>;
    getOneUser(id: number): Promise<{
        success: boolean;
        data: {
            id: number;
            fullName: string;
            email: string;
            photo: string | null;
            password: string;
            position: string;
            hire_date: Date;
            role: import("@prisma/client").$Enums.Role;
            address: string | null;
            status: import("@prisma/client").$Enums.UserStatus;
            created_at: Date;
            updated_at: Date;
        };
    }>;
    updateUser(id: number, payload: UpdateUserDto): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteUser(id: number): Promise<void>;
}
