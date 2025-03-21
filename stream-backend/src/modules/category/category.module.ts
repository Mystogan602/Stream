import { CategoryResolver } from './category.resolver';
import { CategoryService } from './category.service';
import { Module } from '@nestjs/common';

@Module({
	providers: [CategoryService, CategoryResolver]
})
export class CategoryModule {}
