export interface ICategory {
    id?: string;
    name: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Category implements ICategory {
    id?: string;
    name: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;

    constructor(category: ICategory) {
        this.id = category.id;
        this.name = category.name;
        this.description = category.description;
        this.createdAt = category.createdAt || new Date();
        this.updatedAt = category.updatedAt || new Date();
    }
}
