parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"
../node_modules/@babel/node/bin/babel-node.js --extensions '.ts,.js,.json' ../node_modules/knex/bin/cli.js migrate:latest --knexfile  ../database/connections/pg_knexfile.js