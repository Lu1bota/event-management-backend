import { ApiProperty } from '@nestjs/swagger';

export class LoginDtoResponse {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT Access Token used for authenticating requests',
  })
  accessToken: string;
}
