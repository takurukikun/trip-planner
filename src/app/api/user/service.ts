import { Prisma, User } from '@prisma/client'
import { prisma } from '@/app/api/prisma/prisma.config'
import { CreateUserDTO } from '@/app/api/user/dto/createUser'
import bcrypt from 'bcrypt'

async function findOne(args: Prisma.UserFindUniqueArgs): Promise<User | null> {
  return prisma.user.findUnique(args)
}

async function find(args: Prisma.UserFindManyArgs): Promise<User[]> {
  return prisma.user.findMany(args)
}

async function create(data: CreateUserDTO): Promise<User> {
  return prisma.user.create({
    data,
  })
}
async function update({
  data,
  ...remaining
}: Prisma.UserUpdateArgs): Promise<User> {
  return prisma.user.update({ ...remaining, data })
}

function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export const deleteOne = async (id: number) => {
  return prisma.user.delete({ where: { id } })
}

export const userService = {
  findOne,
  comparePassword,
  hashPassword,
  find,
  create,
  update,
  deleteOne,
}
