const getEnvVariable = function(name, def){ return process.env[name] || def; }

module.exports = { getEnvVariable };