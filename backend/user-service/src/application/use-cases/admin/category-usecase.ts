import { ICategoryRepository } from '../../../domain/repositories/category-repository';
import { Category } from '../../../domain/entities/category';
import { RabbitMQService } from '../../../infrastructure/services/rabbitMqService';

export class CreateCategoryUseCase {
    constructor(private readonly categoryRepository: ICategoryRepository) {}

    async execute(categoryData: { name: string; description?: string }): Promise<Category> {
        const category = new Category({
            name: categoryData.name,
            description: categoryData.description
        });  
         if(category){
            RabbitMQService.publishCategoryUpdate({
                ...category,
                action: 'create'
            });
         }
    
        return await this.categoryRepository.create(category);
    }
}
export class UpdateCategoryUseCase {
    constructor(private readonly categoryRepository: ICategoryRepository) {}

    async execute(categoryId: string, categoryData: { name: string; description?: string }) {
        try {
            const oldCategory = await this.categoryRepository.findById(categoryId);
            if (!oldCategory) {
                throw new Error('Category not found');
            }

            const updatedCategory = await this.categoryRepository.update(categoryId, categoryData); 
            console.log("updatedCategory", updatedCategory);
            if (!updatedCategory) {
                throw new Error("Failed to update category.");
            }

            // Ensure the correct oldName and newName are sent
            await RabbitMQService.publishCategoryUpdate({
                oldName: oldCategory.name,  // Correct old name
                name: updatedCategory.name, // Correct new name
                description: updatedCategory.description,
                action: 'update'
            });

            return updatedCategory;
        } catch (error) {
            console.error('Error updating category:', error);
            throw error;
        }
    }
} 



export class DeleteCategoryUseCase {
    constructor(private readonly categoryRepository: ICategoryRepository) {}

    async execute(categoryId: string) {
        try {
            // First get the category to be deleted
            const categoryToDelete = await this.categoryRepository.findById(categoryId);
            if (!categoryToDelete) {
                throw new Error('Category not found');
            }

            // Delete the category
            const result = await this.categoryRepository.delete(categoryId);

            // Publish delete event to RabbitMQ
            await RabbitMQService.publishCategoryUpdate({
                oldName: categoryToDelete.name,
                name: categoryToDelete.name, // Include name for consistency
                description: categoryToDelete.description,
                action: 'delete'
            });

            return result;
        } catch (error) {
            console.error('Error deleting category:', error);
            throw error;
        }
    }
}

