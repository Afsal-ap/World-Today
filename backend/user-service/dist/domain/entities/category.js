"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
class Category {
    constructor(category) {
        this.id = category.id;
        this.name = category.name;
        this.description = category.description;
        this.createdAt = category.createdAt || new Date();
        this.updatedAt = category.updatedAt || new Date();
    }
}
exports.Category = Category;
