import { Matches, MaxLength, MinLength } from 'class-validator';
import { Task } from 'src/tasks/entities/task.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique('user-create-data', ['username'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @MinLength(8)
  @MaxLength(32)
  username: string;

  @Column()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is weak',
  })
  password: string;

  @OneToMany(() => Task, (task) => task.user, { eager: true })
  tasks: Task[];
}
