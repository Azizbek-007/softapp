import { Controller, Get} from '@nestjs/common';
import { ShareService } from './share.service';

@Controller('share')
export class ShareController {
  constructor(private readonly shareService: ShareService) {}

  @Get()
  share_check() {
    return this.shareService.add_check();
  }
}
