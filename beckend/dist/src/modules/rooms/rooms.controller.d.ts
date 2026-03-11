import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create.room.dto';
export declare class RoomsController {
    private readonly roomService;
    constructor(roomService: RoomsService);
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
