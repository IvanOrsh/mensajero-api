import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';

import { SharedService } from '@app/shared';
import { PresenceService } from './presence.service';
import { AuthGuard } from '@app/shared/auth.guard';

@Controller()
export class PresenceController {
  constructor(
    private readonly presenceService: PresenceService,
    private readonly sharedService: SharedService,
    // Temp
    private readonly authGuard: AuthGuard,
  ) {}

  @MessagePattern({ cmd: 'get-presence' })
  async addSubscriber(@Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);

    // TMP
    console.log(123, this.authGuard.hasJwt());

    return this.presenceService.getHello();
  }
}
