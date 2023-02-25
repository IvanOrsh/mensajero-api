import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';

import { PresenceService } from './presence.service';

@Controller()
export class PresenceController {
  constructor(private readonly presenceService: PresenceService) {}

  @MessagePattern({ cmd: 'get-presence' })
  async addSubscriber(@Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage);

    return this.presenceService.getHello();
  }
}
