import { Injectable } from "@nestjs/common";
import { UserRepository } from "../user-repository";
import { User } from "@prisma/client";
import { PrismaService } from "src/infra/database/prisma.service";
import { ResourceNotFound } from "src/erros/resource-not-found";

@Injectable()
export class PrismaUserRepository implements UserRepository {

  constructor(private prismaService: PrismaService) { }

  async create(data: { first_name: string; last_name: string; password: string; email: string }): Promise<User> {
    const user = await this.prismaService.user.create({
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password
      }
    })
    return user;
  }

  async findUserById(userId: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({ where: { id: userId } })
    if (!user) {
      throw new ResourceNotFound()
    }
    return user;
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({ where: { email } })
    if (!user) {
      throw new ResourceNotFound()
    }
    return user;
  }

  async findAllUsers(page: number): Promise<User[]> {
    const users = await this.prismaService.user.findMany({ skip: page, take: 10, orderBy: { first_name: "asc" } })
    return users;
  }

  //TODO: Check if firstName and lastName isn't null or undefined before update the user
  async updateUser(userId: string, data: { firstName?: string; lastName?: string; }): Promise<void> {
    await this.prismaService.user.update({ where: { id: userId }, data: { first_name: data.firstName, last_name: data.lastName } })
  }

  async deleteUser(userId: string): Promise<void> {
    await this.prismaService.user.delete({ where: { id: userId } })
  }


}
