import { CreateRoomDto } from './dto/create.room.dto';
import { PrismaService } from 'src/database/prisma.service';
export declare class RoomsService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllRoom(): Promise<{
        success: boolean;
        data: {
            id: number;
            status: import("@prisma/client").$Enums.UserStatus;
            created_at: Date;
            updated_at: Date;
            name: string;
            capacity: number;
        }[];
    }>;
    createRoom(payload: CreateRoomDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
