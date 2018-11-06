'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = true;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */

function getEmitter() {
    const events = {};

    function getEvents(event) {
        let result = [];
        let eventParse = event.split('.');
        while (eventParse.length > 0) {
            let eventName = eventParse.join('.');
            if (events[eventName]) {
                result.push(eventName);
            }
            eventParse.pop();
        }

        return result;
    }

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            if (!events.hasOwnProperty(event)) {
                events[event] = new Map();
            }
            events[event].set(context, handler);

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            for (let element in events) {
                if (element === event || element.startsWith(event + '.')) {
                    events[element].delete(context);
                }
            }

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            getEvents(event)
                .forEach(eventName => events[eventName]
                    .forEach((handler, context) => handler.call(context)));

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object}
         */
        several: function (event, context, handler, times) {
            console.info(event, context, handler, times);
            this.on(event, context, () => {
                if (times > 0) {
                    handler.call(context);
                }
                times--;
            });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object}
         */
        through: function (event, context, handler, frequency) {
            console.info(event, context, handler, frequency);
            let callsCount = 0;
            this.on(event, context, () => {
                if (callsCount % frequency === 0) {
                    handler.call(context);
                }
                callsCount++;
            });

            return this;
        }
    };
}


module.exports = {
    getEmitter,

    isStar
};
