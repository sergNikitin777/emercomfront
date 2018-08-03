import { Message } from 'RequestUtils';
import Messages from '../entities/enums/Messages';

/**
 * Обработка ответов на запросы.
 *
 * @param {Object|String} data - Данные.
 *
 * @return {Object|String} response - Обработанный ответ.
 * @throw {Message} message - Сообщение об ошибке.
 */
export default function parseResponse(data)
{
    if (!data || data.error) {
        throw new Message(Messages.INTERNAL_ERROR);
    } else if (data instanceof Message) {
        throw data;
    }

    return data;
}