import * as amqp from "amqplib";
import { redisClient } from "./redis";

export default new (class RabbitMQConfig {
    async sendToMessage(queueName: string, payload: any): Promise<boolean> {
        try {
            const connection = await amqp.connect(process.env.URL_CONNECTION);
            const channel = await connection.createChannel();

            await channel.assertQueue(queueName);

            channel.sendToQueue(queueName, Buffer.from(JSON.stringify(payload)));
            await redisClient.del("threads");

            await channel.close();
            await connection.close();

            return null;
        } catch (error) {
            console.log(error);
            return error;
        }
    }
})();
