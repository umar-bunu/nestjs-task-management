import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { ETaskStatus } from './definitions';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksRepository extends Repository<Task> {
  constructor(_dataSource: DataSource) {
    super(Task, _dataSource.createEntityManager());
  }

  async createTask(createTaskDto: CreateTaskDto, user: User) {
    const task = this.create({
      user,
      ...createTaskDto,
      status: ETaskStatus.OPEN,
    });
    await this.save(task);

    return task;
  }

  async getTasks(filterDto: any, user?: User) {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');

    if (user) query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }
    return await query.getMany();
  }
}
