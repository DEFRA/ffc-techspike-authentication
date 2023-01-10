const Joi = require('joi')
const authConfig = require('./auth')

const schema = Joi.object({
  appInsights: Joi.object(),
  cache: {
    expiresIn: Joi.number().default(1000 * 3600 * 24 * 3), // 3 days
    options: {
      host: Joi.string().default('redis-hostname.default'),
      partition: Joi.string().default('ffc-techspike-authentication'),
      password: Joi.string().allow(''),
      port: Joi.number().default(6379),
      tls: Joi.object()
    }
  },
  cookie: {
    cookieNameAuth: Joi.string().default('ffc_techspike_authentication'),
    cookieNameSession: Joi.string().default('fc_techspike_authentication_session'),
    isSameSite: Joi.string().default('Lax'),
    isSecure: Joi.boolean().default(true),
    password: Joi.string().min(32).required(),
    ttl: Joi.number().default(1000 * 3600 * 24 * 3) // 3 days
  },
  env: Joi.string().valid('development', 'test', 'production').default(
    'development'
  ),
  isDev: Joi.boolean().default(false),
  port: Joi.number().default(3000),
  useRedis: Joi.boolean().default(false),
  useHttps: Joi.boolean().default(false).allow('', null)
})

const config = {
  appInsights: require('applicationinsights'),
  cache: {
    options: {
      host: process.env.REDIS_HOSTNAME,
      password: process.env.REDIS_PASSWORD,
      port: process.env.REDIS_PORT,
      tls: process.env.NODE_ENV === 'production' ? {} : undefined
    }
  },
  cookie: {
    cookieNameAuth: 'ffc_techspike_authentication',
    cookieNameSession: 'ffc_techspike_authentication_session',
    isSameSite: 'Lax',
    isSecure: process.env.NODE_ENV === 'production',
    password: process.env.COOKIE_PASSWORD
  },
  env: process.env.NODE_ENV,
  isDev: process.env.NODE_ENV === 'development',
  port: process.env.PORT,
  useRedis: process.env.NODE_ENV !== 'test',
  useHttps: process.env.USE_HTTPS > 0 ? process.env.USE_HTTPS : false
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The server config is invalid. ${result.error.message}`)
}

const value = result.value
value.authConfig = authConfig

module.exports = value
