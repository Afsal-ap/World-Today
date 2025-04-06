// src/infrastructure/services/RabbitMQService.ts
import amqp from "amqplib";

export class RabbitMQService {
  private static connection: amqp.Connection;
  private static channel: amqp.Channel;
  private static exchange = "category_events";

  static async connect() {  
    if (!this.connection) {
      const url = process.env.RABBITMQ_URL || "amqp://guest:guest@rabbitmq-service:5672";
      this.connection = await amqp.connect(url);
      this.channel = await this.connection.createChannel();
      await this.channel.assertExchange(this.exchange, "direct", { durable: true });
      console.log("Connected to RabbitMQ");
    }
  }

  static async publishCategoryUpdate(category: any) {
    if (!this.channel) await this.connect();
    console.log("called the rabbitmq service");
    const message = {
      oldName: category.oldName || null,
      newName: category.name,
      description: category.description,
      action: category.action
    };
    this.channel.publish(this.exchange, "category.update", Buffer.from(JSON.stringify(message)));
    console.log("Category update published:", message);
  }
}
