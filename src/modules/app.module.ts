import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { SubCategoryModule } from './subcategory/subcategory.module';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { ShipmentModule } from './shipment/shipment.module';
import { CityModule } from './city/city.module';
import { DistrictModule } from './district/district.module';
import { WardModule } from './ward/ward.module';
import { CommentModule } from './comment/comment.module';
import { RateModule } from './rate/rate.module';
import { UploadModule } from './upload/upload.module';
import { LikeModule } from './like/like.module';
import { StatisticModule } from './statistic/statistic.module';
import { ExcelModule } from './excel/excel.module';
import { ExportModule } from './export/export.module';
import { EmailModule } from './email/email.module';
import { SettingModule } from './setting/setting.module';
import { GlobalModule } from './global/global.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    CloudinaryModule,
    ExcelModule,
    EmailModule,
    StatisticModule,
    UserModule,
    AuthModule,
    CategoryModule,
    SubCategoryModule,
    ProductModule,
    CartModule,
    OrderModule,
    ShipmentModule,
    CityModule,
    DistrictModule,
    WardModule,
    CommentModule,
    RateModule,
    LikeModule,
    UploadModule,
    ExportModule,
    SettingModule,
    GlobalModule,
  ],
})
export class AppModule {}
