import { Request, Response } from 'express';
import { ICategoryRepository } from '../../domain/repositories/category-repository';

export class CategoryController {
  constructor(private categoryRepository: ICategoryRepository) {}

  async getCategories(req: Request, res: Response) {
    try {
      const categories = await this.categoryRepository.findAll();
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
