import { Exclude } from 'class-transformer';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ETaskStatus } from '../definitions';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: ETaskStatus;

  @ManyToOne(() => User, (type) => type.tasks, {
    eager: false,
  })
  @Exclude({ toPlainOnly: true })
  user?: User;
}
