import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
  UseGuards,
  Body,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { QueryPaging } from 'src/common/decorator/query.decorator';
import { QueryDto } from 'src/common/dto/query.dto';
import { LikeDto } from './like.dto';

@Controller('api/like')
export class LikeController {
  constructor(private likeService: LikeService) {}

  @Get('list')
  @HttpCode(HttpStatus.OK)
  getLikes(@QueryPaging() query: QueryDto) {
    return this.likeService.getLikes(query);
  }

  @Get('listPaging')
  @HttpCode(HttpStatus.OK)
  getLikesPaging(@QueryPaging() query: QueryDto) {
    return this.likeService.getLikesPaging(query);
  }

  @Get('detail')
  @HttpCode(HttpStatus.OK)
  getLike(@Query() query: QueryDto) {
    return this.likeService.getLike(query);
  }

  @Post('create')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  createLike(@Body() like: LikeDto) {
    return this.likeService.createLike(like);
  }

  @Put('update')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  updateLike(@Query() query: QueryDto, @Body() like: LikeDto) {
    return this.likeService.updateLike(query, like);
  }

  @Delete('remove')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  removeLikes(@Query() query: QueryDto) {
    return this.likeService.removeLikes(query);
  }
}
