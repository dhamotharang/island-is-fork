import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import { CreateUser, UserRole } from '@island.is/judicial-system/types'

@InputType()
export class CreateUserInput implements CreateUser {
  @Allow()
  @Field()
  readonly nationalId!: string

  @Allow()
  @Field()
  readonly name!: string

  @Allow()
  @Field()
  readonly title!: string

  @Allow()
  @Field()
  readonly mobileNumber!: string

  @Allow()
  @Field()
  readonly email!: string

  @Allow()
  @Field(() => String)
  readonly role!: UserRole

  @Allow()
  @Field()
  readonly institution!: string

  @Allow()
  @Field()
  readonly active!: boolean
}