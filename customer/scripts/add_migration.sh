
../node_modules/.bin/babel-node --extensions '.ts,.js,.json' ../node_modules/knex/bin/cli.js migrate:make "$1" --knexfile  ../database/connections/pg_knexfile.js
