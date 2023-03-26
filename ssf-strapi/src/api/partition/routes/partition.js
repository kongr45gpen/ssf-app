'use strict';

/**
 * partition router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::partition.partition');
