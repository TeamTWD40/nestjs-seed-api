import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class CreateProfileDto {
    @ApiModelProperty()
    readonly first: string;
    @ApiModelProperty()
    readonly last: string;
    @ApiModelProperty()
    readonly email: string;
    @ApiModelPropertyOptional()
    readonly phone: string;
    @ApiModelPropertyOptional()
    readonly addressOne: string;
    @ApiModelPropertyOptional()
    readonly addressTwo: string;
}
