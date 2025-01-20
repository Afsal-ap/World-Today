import { ICategoryRepository } from '../../domain/repositories/category-repository';
import { Category } from '../../domain/entities/category';
import { CategoryModel } from '../db/models/categoryModel';

export class CategoryRepositoryImpl implements ICategoryRepository {
    async create(category: Category): Promise<Category> {
        const newCategory = await CategoryModel.create(category);
        return new Category({
            id: newCategory._id.toString(),
            name: newCategory.name,
            description: newCategory.description ?? undefined,
            createdAt: newCategory.createdAt,
            updatedAt: newCategory.updatedAt
        });
    }

    async findAll(): Promise<Category[]> {
        const categories = await CategoryModel.find();
        return categories.map(cat => new Category({
            id: cat._id.toString(),
            name: cat.name,
            description: cat.description ?? undefined,
            createdAt: cat.createdAt,
            updatedAt: cat.updatedAt
        }));
    }

    async findById(id: string): Promise<Category | null> {
        const category = await CategoryModel.findById(id);
        if (!category) return null;
        return new Category({
            id: category._id.toString(),
            name: category.name,
            description: category.description ?? undefined,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt
        });
    }

    async update(id: string, categoryData: Partial<Category>): Promise<Category | null> {
        const updated = await CategoryModel.findByIdAndUpdate(
            id,
            { ...categoryData, updatedAt: new Date() },
            { new: true }
        );
        if (!updated) return null;
        return new Category({
            id: updated._id.toString(),
            name: updated.name,
            description: updated.description ?? undefined,
            createdAt: updated.createdAt,
            updatedAt: updated.updatedAt
        });
    }

    async delete(id: string): Promise<void> {
        await CategoryModel.findByIdAndDelete(id);
    }
}
