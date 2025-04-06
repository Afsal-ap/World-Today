"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteCategoryUseCase = exports.UpdateCategoryUseCase = exports.CreateCategoryUseCase = void 0;
const category_1 = require("../../../domain/entities/category");
const rabbitMqService_1 = require("../../../infrastructure/services/rabbitMqService");
class CreateCategoryUseCase {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    execute(categoryData) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = new category_1.Category({
                name: categoryData.name,
                description: categoryData.description
            });
            if (category) {
                rabbitMqService_1.RabbitMQService.publishCategoryUpdate(Object.assign(Object.assign({}, category), { action: 'create' }));
            }
            return yield this.categoryRepository.create(category);
        });
    }
}
exports.CreateCategoryUseCase = CreateCategoryUseCase;
class UpdateCategoryUseCase {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    execute(categoryId, categoryData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const oldCategory = yield this.categoryRepository.findById(categoryId);
                if (!oldCategory) {
                    throw new Error('Category not found');
                }
                const updatedCategory = yield this.categoryRepository.update(categoryId, categoryData);
                console.log("updatedCategory", updatedCategory);
                if (!updatedCategory) {
                    throw new Error("Failed to update category.");
                }
                // Ensure the correct oldName and newName are sent
                yield rabbitMqService_1.RabbitMQService.publishCategoryUpdate({
                    oldName: oldCategory.name, // Correct old name
                    name: updatedCategory.name, // Correct new name
                    description: updatedCategory.description,
                    action: 'update'
                });
                return updatedCategory;
            }
            catch (error) {
                console.error('Error updating category:', error);
                throw error;
            }
        });
    }
}
exports.UpdateCategoryUseCase = UpdateCategoryUseCase;
class DeleteCategoryUseCase {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    execute(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // First get the category to be deleted
                const categoryToDelete = yield this.categoryRepository.findById(categoryId);
                if (!categoryToDelete) {
                    throw new Error('Category not found');
                }
                // Delete the category
                const result = yield this.categoryRepository.delete(categoryId);
                // Publish delete event to RabbitMQ
                yield rabbitMqService_1.RabbitMQService.publishCategoryUpdate({
                    oldName: categoryToDelete.name,
                    name: categoryToDelete.name, // Include name for consistency
                    description: categoryToDelete.description,
                    action: 'delete'
                });
                return result;
            }
            catch (error) {
                console.error('Error deleting category:', error);
                throw error;
            }
        });
    }
}
exports.DeleteCategoryUseCase = DeleteCategoryUseCase;
