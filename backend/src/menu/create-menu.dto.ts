import { IsString, IsNotEmpty, Length, IsNumber, Min } from 'class-validator';

export class CreateMenuDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @IsNumber()
  @Min(0)
  price: number;
}