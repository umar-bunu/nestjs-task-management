import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository) private tasksRepository: TasksRepository,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: User) {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  findAll(params: any, user: User) {
    return this.tasksRepository.getTasks(params, user);
  }

  async findOne(id: string, user: User) {
    try {
      const found = await this.tasksRepository.findOne({
        where: {
          id,
          user,
        },
      });
      if (!found) throw new NotFoundException();
      return found;
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new NotFoundException();
      }

      throw new InternalServerErrorException();
    }
  }

  async update(id: string, { status }: UpdateTaskDto, user: User) {
    const task = await this.findOne(id, user);
    if (!task) throw new NotFoundException();
    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }

  async remove(id: string) {
    const result = await this.tasksRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException();
    return result;
  }
}
