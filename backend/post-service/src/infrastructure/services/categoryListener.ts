import { RabbitMQService } from "./rabbitMQService";
import { CategoryModel } from "../db/model/CategoryModel";
import { PostModel } from "../db/model/PostModel";

interface CategoryMessage {
    oldName: string;
    newName: string;
    description?: string;
    action: 'create' | 'update' | 'delete';
}

export class CategoryListener {
  static async startListening() {
    try {
      console.log("Starting category listener...");
      await RabbitMQService.connect();
      console.log("Connected to RabbitMQ, setting up message consumer...");

      await RabbitMQService.consumeMessages(async (message: CategoryMessage) => {
        console.log("Raw message received:", message);
        const { oldName, newName, description, action } = message;
        console.log(`Processing category ${action}: ${oldName} -> ${newName}`);

        switch (action) {
          case 'create':
            await this.handleCategoryCreate(newName, description);
            break;
          
          case 'update':
            await this.handleCategoryUpdate(oldName, newName, description);
            break;
          
          case 'delete':
            await this.handleCategoryDelete(oldName);
            break;
        }
      });
    } catch (error) {
      console.error("Error in CategoryListener:", error);
      setTimeout(() => this.startListening(), 5000);
    }
  }

  private static async handleCategoryCreate(name: string, description?: string) {
    try {
      const existingCategory = await CategoryModel.findOne({ name });
      if (!existingCategory) {
        await CategoryModel.create({ name, description });
        console.log(`Category created: ${name}`);
      }
    } catch (error) {
      console.error(`Error creating category: ${error}`);
      throw error;
    }
  }

  private static async handleCategoryUpdate(oldName: string, newName: string, description?: string) {
    try {
        console.log(`Attempting to update category from '${oldName}' to '${newName}'`);
        
        const existingCategory = await CategoryModel.findOne({ name: oldName });
        if (!existingCategory) {
            console.error(`Category '${oldName}' not found. Skipping update.`);
            return;
        }

        const updatedCategory = await CategoryModel.findOneAndUpdate(
            { name: oldName },
            { 
                name: newName, 
                description,
                updatedAt: new Date()
            },  
            { new: true }  // Remove 'upsert: true' to avoid inserting new categories
        );

        if (updatedCategory) {
            console.log('Category updated successfully:', updatedCategory);

            // Update all posts with the old category name
            const result = await PostModel.updateMany(
                { category: oldName },
                { $set: { category: newName } }
            );

            console.log(`Updated ${result.modifiedCount} posts with new category name`);
        } else {
            console.error(`Category '${oldName}' update failed.`);
        }
    } catch (error) {
        console.error(`Error updating category: ${error}`);
        throw error;
    }
}
 

  private static async handleCategoryDelete(name: string) {
    try {
      await CategoryModel.findOneAndDelete({ name });
      // You might want to handle posts with this category
      // For example, set them to a default category or mark them as uncategorized
      await PostModel.updateMany(
        { category: name },
        { $set: { category: 'Uncategorized' } }
      );
    } catch (error) {
      console.error(`Error deleting category: ${error}`);
      throw error;
    }
  }
}
