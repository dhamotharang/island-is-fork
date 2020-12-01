import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class RegisterProviderInput {
  @Field(() => String)
  @IsString()
  nationalId!: string
}