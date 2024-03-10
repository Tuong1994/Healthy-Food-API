import { IsNotEmpty } from 'class-validator';

export class SettingPermissionDto {
  @IsNotEmpty()
  create: boolean;

  @IsNotEmpty()
  update: boolean;

  @IsNotEmpty()
  remove: boolean;

  @IsNotEmpty()
  userId: string;
}
