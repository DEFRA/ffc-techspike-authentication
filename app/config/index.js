const Joi = require('joi')
const authConfig = require('./auth')

const schema = Joi.object({
  appInsights: Joi.object(),
  env: Joi.string().valid('development', 'test', 'production').default(
    'development'
  ),
  isDev: Joi.boolean().default(false),
  port: Joi.number().default(3000)
})

const config = {
  appInsights: require('applicationinsights'),
  env: process.env.NODE_ENV,
  isDev: process.env.NODE_ENV === 'development',
  port: process.env.PORT
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
