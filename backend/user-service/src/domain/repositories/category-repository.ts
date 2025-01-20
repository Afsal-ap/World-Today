import { Category } from '../entities/category';

export interface ICategoryRepository {
    create(category: Category): Promise<Category>;
    findAll(): Promise<Category[]>;
    findById(id: string): Promise<Category | null>;
    update(id: string, category: Partial<Category>): Promise<Category | null>;
    delete(id: string): Promise<void>;
}
