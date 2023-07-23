import { PartialType } from '@nestjs/mapped-types';
import { IsEnum } from 'class-validator';
import { ETaskStatus } from '../definitions';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsEnum(ETaskStatus)
  status: ETaskStatus;
}
