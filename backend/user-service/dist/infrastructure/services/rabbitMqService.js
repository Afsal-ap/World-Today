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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQService = void 0;
// src/infrastructure/services/RabbitMQService.ts
const amqplib_1 = __importDefault(require("amqplib"));
class RabbitMQService {
    static connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.connection) {
                const url = process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";
                this.connection = yield amqplib_1.default.connect(url);
                this.channel = yield this.connection.createChannel();
                yield this.channel.assertExchange(this.exchange, "direct", { durable: true });
                console.log("Connected to RabbitMQ");
            }
        });
    }
    static publishCategoryUpdate(category) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.channel)
                yield this.connect();
            console.log("called the rabbitmq service");
            const message = {
                oldName: category.oldName || null,
                newName: category.name,
                description: category.description,
                action: category.action
            };
            this.channel.publish(this.exchange, "category.update", Buffer.from(JSON.stringify(message)));
            console.log("Category update published:", message);
        });
    }
}
exports.RabbitMQService = RabbitMQService;
RabbitMQService.exchange = "category_events";
