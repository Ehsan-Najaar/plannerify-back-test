import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ContentsService } from './contents.service';
import { CreateContentDto } from './dto/create-content.dto';

@Controller('contents')
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'videoFile', maxCount: 1 },
        { name: 'featureImage_1', maxCount: 1 },
        { name: 'featureImage_2', maxCount: 1 },
        { name: 'featureImage_3', maxCount: 1 },
        { name: 'featureImage_4', maxCount: 1 },
        { name: 'featureImage_5', maxCount: 1 },
        { name: 'featureImage_6', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            const dest = process.env.ASSETS_PATH;
            cb(null, dest);
          },
          filename: (req, file, callback) => {
            // Custom file naming: originalname-timestamp.ext
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            const fileExt = extname(file.originalname);
            const fileName =
              file.originalname.replace(/\s+/g, '_').split('.')[0] +
              '-' +
              uniqueSuffix +
              fileExt;
            callback(null, fileName);
          },
        }),
      },
    ),
  )
  create(
    @Body() createContentDto: CreateContentDto,
    @UploadedFiles()
    files: {
      videoFile?: Express.Multer.File[];
    },
  ) {
    return this.contentsService.create(createContentDto, files);
  }

  @Get()
  findAll() {
    return this.contentsService.findAll();
  }
}
