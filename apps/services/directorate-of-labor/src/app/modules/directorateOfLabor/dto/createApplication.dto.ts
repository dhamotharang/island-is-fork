import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator'
import { IsNationalId } from '@island.is/nest/validators'
import { ApiProperty } from '@nestjs/swagger'

export class CreateApplicationDto {
  @ApiProperty()
  @IsNationalId()
  nationalId!: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  secretWord!: string

  @ApiProperty()
  @IsBoolean()
  getPaperCopy!: boolean

  @ApiProperty()
  @IsString()
  employmentStatus!: string

  @ApiProperty()
  @IsInt()
  employmentRatio!: number

  @ApiProperty()
  @IsString()
  bank!: string

  @ApiProperty()
  @IsString()
  pensionFund!: string

  @ApiProperty()
  @IsString()
  union!: string

  @ApiProperty()
  @IsString()
  privatePensionFund!: string

  @ApiProperty()
  @IsNumber()
  pensionFundPercentage!: number

  @ApiProperty()
  @IsNumber()
  personalTaxCreditRatio!: number

  @ApiProperty()
  @IsNumber()
  personalTaxCreditMonthlyAmount!: number

  @ApiProperty()
  @IsInt()
  monthlyIncome!: number

  @ApiProperty()
  @IsInt()
  insurancePayments!: number

  @ApiProperty()
  @IsNumber()
  pensionPayments!: number

  @ApiProperty()
  @IsNumber()
  incomeStepOne!: number

  @ApiProperty()
  @IsNumber()
  incomeStepTwo!: number

  @ApiProperty()
  @IsBoolean()
  onParentalLeave!: boolean
}