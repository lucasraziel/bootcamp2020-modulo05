import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import authConfig from '@config/authConfig';
import AppError from '@shared/errors/AppError';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

export default class AuthenticateUserService {
  constructor(private usersRepository: IUsersRepository) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const { secret, expiresIn } = authConfig.jwt;

    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Incorrect email/password', 401);
    }

    const passwordMathed = await compare(password, user.password);

    if (!passwordMathed) {
      throw new AppError('Incorrect email/password', 401);
    }

    delete user.password;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return {
      user,
      token,
    };
  }
}
