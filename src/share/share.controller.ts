import { Controller, Get, Query} from '@nestjs/common';
import { ShareService } from './share.service';

@Controller()
export class ShareController {
  constructor(private readonly shareService: ShareService) {}

  @Get()
  share_check(@Query('share') share_code: string) {
    return this.shareService.add_check(share_code);
  }
}
