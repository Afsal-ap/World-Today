import { ICategoryRepository } from '../../../domain/repositories/category-repository';
import { Category } from '../../../domain/entities/category';

export class CreateCategoryUseCase {
    constructor(private readonly categoryRepository: ICategoryRepository) {}

    async execute(categoryData: { name: string; description?: string }): Promise<Category> {
        const category = new Category({
            name: categoryData.name,
            description: categoryData.description
        });
        return await this.categoryRepository.create(category);
    }
}
