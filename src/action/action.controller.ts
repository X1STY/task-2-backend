import { Body, Controller, Put, Query } from '@nestjs/common';
import { ActionService } from './action.service';
import { ActionBodyDto, ActionQueryDto } from './dto/actions.dto';

@Controller('action')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @Put('')
  async handleAction(
    @Query() query: ActionQueryDto,
    @Body() body: ActionBodyDto,
  ) {
    return await this.actionService.handleAction(query, body);
  }
}
