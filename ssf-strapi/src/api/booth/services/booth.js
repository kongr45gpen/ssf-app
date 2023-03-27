'use strict';

/**
 * booth service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::booth.booth');
