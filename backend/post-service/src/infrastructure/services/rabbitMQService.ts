import * as amqp from 'amqplib';

export class RabbitMQService {
  private static connection: amqp.Connection;
  private static channel: amqp.Channel;
  private static readonly EXCHANGE = "category_events";
  private static readonly QUEUE = "post_service_category_queue";
  private static readonly ROUTING_KEY = ""; // Not needed for fanout exchanges

  static async connect() {
    try {   
      if (!this.connection) {
        const url = process.env.RABBITMQ_URL || "amqp://localhost:5672";
        this.connection = await amqp.connect(url);
        this.channel = await this.connection.createChannel();

        // Change to direct exchange to match existing configuration
        await this.channel.assertExchange(this.EXCHANGE, "direct", { 
          durable: true 
        });

        // Assert queue with dead letter exchange
        const queue = await this.channel.assertQueue(this.QUEUE, { 
          durable: true,
          deadLetterExchange: "dlx.category",
          deadLetterRoutingKey: "dlq.category"
        });

        // For direct exchange, we need a specific routing key
        await this.channel.bindQueue(queue.queue, this.EXCHANGE, "category.update");

        // Handle connection closure  
        this.connection.on("close", () => {
          console.error("RabbitMQ connection closed. Attempting to reconnect...");
          setTimeout(() => this.connect(), 5000);
        });

        console.log("Successfully connected to RabbitMQ");
      }
    } catch (error) {
      console.error("RabbitMQ connection error:", error);
      setTimeout(() => this.connect(), 5000);
    }
  }

  static async consumeMessages(callback: (msg: any) => Promise<void>) {
    try {
      if (!this.channel) await this.connect();

      await this.channel.consume(this.QUEUE, async (msg) => {
        if (msg) {
          try {
            const content = JSON.parse(msg.content.toString());
            console.log("Received category update:", content);
            await callback(content);
            this.channel.ack(msg);
          } catch (error) {
            console.error("Error processing message:", error);
            // Reject the message and don't requeue if it's malformed
            this.channel.nack(msg, false, false);
          }
        }
      });   

      console.log("Listening for category updates...");
    } catch (error) {
      console.error("Error in consumeMessages:", error);
      setTimeout(() => this.consumeMessages(callback), 5000);
    }
  }

  static async closeConnection() {
    try {
      await this.channel?.close();
      await this.connection?.close();
    } catch (error) {
      console.error("Error closing RabbitMQ connection:", error);
    }
  }
}
