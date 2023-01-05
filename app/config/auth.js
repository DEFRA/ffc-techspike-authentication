const Joi = require('joi')

// Define config schema
const schema = Joi.object({
  defraId: Joi.object({
    clientId: Joi.string(),
    authority: Joi.string(),
    clientSecret: Joi.string(),
    knownAuthorities: Joi.array().items(Joi.string()).allow(''),
    redirectUrl: Joi.string().default('https://localhost:3000/apply/signin-oidc'),
    validateAuthority: Joi.boolean().default(false),
    scope: Joi.string().allow(''),
    signoutRedirectUrl: Joi.string().default('https://localhost:3000'),
    signoutUrl: Joi.string()
  }),
  cookie: Joi.object({
    password: Joi.string().required(),
    ttl: Joi.number().default(60 * 60 * 1000)
  }),
  serviceId: Joi.string().allow(''),
  tenantName: Joi.string().allow('')
})

// Build config
const config = {
  defraId: {
    clientId: process.env.DEFRAID_CLIENT_ID,
    authority: `https://${process.env.DEFRAID_TENANT_NAME}.b2clogin.com/${process.env.DEFRAID_TENANT_NAME}.onmicrosoft.com`,
    clientSecret: process.env.DEFRAID_CLIENT_SECRET,
    knownAuthorities: [process.env.DEFRAID_KNOWN_AUTHORITIES],
    redirectUrl: process.env.DEFRAID_REDIRECT_URL.length > 0 ? process.env.DEFRAID_REDIRECT_URL : 'https://localhost:3000/apply/signin-oidc',
    signoutUrl: process.env.DEFRAID_SIGNOUT_URL,
    signoutRedirectUrl: process.env.DEFRAID_SIGNOUT_REDIRECT_URL.length > 0 ? process.env.DEFRAID_SIGNOUT_REDIRECT_URL : 'https://localhost:3000',
    validateAuthority: process.env.DEFRAID_VALIDATE_AUTHORITY,
    scope: process.env.DEFRAID_SCOPE.length > 0 ? process.env.DEFRAID_SCOPE_URL : `openid ${process.env.DEFRAID_CLIENT_ID} offline_access`
  },
  cookie: {
    password: process.env.COOKIE_PASSWORD,
    ttl: process.env.COOKIE_TTL
  },
  serviceId: process.env.DEFRAID_SERVICE_ID,
  tenantName: process.env.DEFRAID_TENANT_NAME
}

// Validate config
const result = schema.validate(config, {
  abortEarly: false
})

// Throw if config is invalid
if (result.error) {
  throw new Error(`The auth config is invalid. ${result.error.message}`)
}

module.exports = result.value
