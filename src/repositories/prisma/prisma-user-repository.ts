import { Injectable } from "@nestjs/common";
import { UserRepository } from "../user-repository";
import { User } from "@prisma/client";
import { PrismaService } from "src/infra/database/prisma.service";
import { ResourceNotFound } from "src/erros/resource-not-found";
import { UpdateUserDto } from "src/user/dtos/update-user-dto";

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
    // TODO: check if this error needs to be here, on the creation needs to check if there is a user that already has this email register
    // if (!user) {
    //   throw new ResourceNotFound()
    // }
    return user;
  }

  async findAllUsers(page: number): Promise<User[]> {
    const users = await this.prismaService.user.findMany({ skip: page, take: 10, orderBy: { first_name: "asc" } })
    return users;
  }

  async updateUser(userId: string, data: UpdateUserDto): Promise<void> {
    const { first_name, last_name, email } = data;
    const updatePayload: any = {};
    if (first_name) {
      updatePayload.first_name = first_name;
    }
    if (last_name) {
      updatePayload.last_name = last_name;
    }
    if (email) {
      updatePayload.email = email;
    }
    await this.prismaService.user.update({ where: { id: userId }, data: updatePayload })
  }

  async deleteUser(userId: string): Promise<void> {
    await this.prismaService.user.delete({ where: { id: userId } })
  }


}
