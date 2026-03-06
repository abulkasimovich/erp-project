import { Role } from "@prisma/client"

export class CreateUserDto {
    fullName: string
    contact: string
    photo?: string
    password: string
    position: string
    hire_date: string
    role: Role
    address?: string
}
