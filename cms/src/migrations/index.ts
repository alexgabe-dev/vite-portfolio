import * as migration_20261124_222831_initial from './20261124_222831_initial';
import * as migration_20261124_224450_deploy_request_status from './20261124_224450_deploy_request_status';

export const migrations = [
  {
    up: migration_20261124_222831_initial.up,
    down: migration_20261124_222831_initial.down,
    name: '20261124_222831_initial',
  },
  {
    up: migration_20261124_224450_deploy_request_status.up,
    down: migration_20261124_224450_deploy_request_status.down,
    name: '20261124_224450_deploy_request_status'
  },
];
