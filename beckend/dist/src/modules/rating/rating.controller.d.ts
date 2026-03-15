import { RatingService } from "./rating.service";
import { CreateRatingDto } from "./dto/create-rating.dto";
export declare class RatingController {
    private service;
    constructor(service: RatingService);
    createRating(payload: CreateRatingDto): Promise<{
        success: boolean;
        message: string;
    }>;
    getRatings(teacherId: number): Promise<{
        success: boolean;
        data: ({
            lesson: {
                id: number;
                created_at: Date;
                updated_at: Date;
                title: string;
                teacherId: number | null;
                userId: number | null;
                groupId: number;
            };
        } & {
            id: number;
            created_at: Date;
            teacherId: number;
            lessonId: number;
            score: number;
        })[];
    }>;
}
