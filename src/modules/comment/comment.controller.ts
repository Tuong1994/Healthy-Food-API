import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { JwtGuard } from 'src/common/guard/jwt.guard';
import { CommentDto } from './comment.dto';
import { QueryPaging } from 'src/common/decorator/query.decorator';
import { RoleGuard } from 'src/common/guard/role.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { ERole } from 'src/common/enum/base';

@Controller('api/comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Get('list')
  @HttpCode(HttpStatus.OK)
  getComments(@Query() query: QueryDto) {
    return this.commentService.getComments(query);
  }

  @Get('listByUser')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  getCommentsByUser(@QueryPaging() query: QueryDto) {
    return this.commentService.getCommentsByUser(query);
  }

  @Get('detail')
  @HttpCode(HttpStatus.OK)
  getComment(@Query() query: QueryDto) {
    return this.commentService.getComment(query);
  }

  @Post('create')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  createComment(@Body() comment: CommentDto) {
    return this.commentService.createComment(comment);
  }

  @Put('update')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  updateComment(@Query() query: QueryDto, @Body() comment: CommentDto) {
    return this.commentService.updateComment(query, comment);
  }

  @Delete('remove')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  removeComments(@Query() query: QueryDto) {
    return this.commentService.removeComments(query);
  }

  @Delete('removePermanent')
  @Roles(ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  removeCommentsPermanent(@Query() query: QueryDto) {
    return this.commentService.removeCommentsPermanent(query);
  }

  @Post('restore')
  @Roles(ERole.LEADER, ERole.MANAGER)
  @UseGuards(JwtGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  restoreComment() {
    return this.commentService.restoreComments();
  }
}
