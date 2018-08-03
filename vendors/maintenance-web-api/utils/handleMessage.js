import { Message } from 'RequestUtils';
import Messages from '../entities/enums/Messages';

/**
 * Обработка сообщений API библиотеки.
 *
 * @param {Message|Object|String} message - Сообщение.
 * @return {Message} message - Обработанное сообщение.
 */
const handleMessage = (message) =>
{
    if (message instanceof Message) {
        return message;
    } else {
        return new Message(Messages.INTERNAL_ERROR);
    }
};

export default handleMessage;