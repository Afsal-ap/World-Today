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
exports.CategoryRepositoryImpl = void 0;
const category_1 = require("../../domain/entities/category");
const categoryModel_1 = require("../db/models/categoryModel");
class CategoryRepositoryImpl {
    create(category) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const newCategory = yield categoryModel_1.CategoryModel.create(category);
            return new category_1.Category({
                id: newCategory._id.toString(),
                name: newCategory.name,
                description: (_a = newCategory.description) !== null && _a !== void 0 ? _a : undefined,
                createdAt: newCategory.createdAt,
                updatedAt: newCategory.updatedAt
            });
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield categoryModel_1.CategoryModel.find();
            return categories.map(cat => {
                var _a;
                return new category_1.Category({
                    id: cat._id.toString(),
                    name: cat.name,
                    description: (_a = cat.description) !== null && _a !== void 0 ? _a : undefined,
                    createdAt: cat.createdAt,
                    updatedAt: cat.updatedAt
                });
            });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const category = yield categoryModel_1.CategoryModel.findById(id);
            if (!category)
                return null;
            return new category_1.Category({
                id: category._id.toString(),
                name: category.name,
                description: (_a = category.description) !== null && _a !== void 0 ? _a : undefined,
                createdAt: category.createdAt,
                updatedAt: category.updatedAt
            });
        });
    }
    update(id, categoryData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const updated = yield categoryModel_1.CategoryModel.findByIdAndUpdate(id, Object.assign(Object.assign({}, categoryData), { updatedAt: new Date() }), { new: true });
            if (!updated)
                return null;
            return new category_1.Category({
                id: updated._id.toString(),
                name: updated.name,
                description: (_a = updated.description) !== null && _a !== void 0 ? _a : undefined,
                createdAt: updated.createdAt,
                updatedAt: updated.updatedAt
            });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield categoryModel_1.CategoryModel.findByIdAndDelete(id);
        });
    }
}
exports.CategoryRepositoryImpl = CategoryRepositoryImpl;
