'use strict';

/**
 * partition service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::partition.partition');
