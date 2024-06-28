import { Body, Controller, HttpCode, Put, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { BadRequestErrorDto } from 'src/error/dto/error.dto';
import { ActionService } from './action.service';
import { ActionBodyDto, ActionQueryDto } from './dto/actions.dto';

@ApiTags('Action')
@Controller('action')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @Put('')
  @ApiBody({ type: ActionBodyDto, required: false })
  @ApiOkResponse()
  @ApiBadRequestResponse({ type: BadRequestErrorDto })
  @HttpCode(200)
  async handleAction(@Query() query: ActionQueryDto, @Body() body?: ActionBodyDto) {
    return await this.actionService.handleAction(query, body);
  }
}
