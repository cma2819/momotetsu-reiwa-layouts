import { game } from './game';
import { NodeCG } from './nodecg';
import { players } from './players';

export = (nodecg: NodeCG): void => {
  game(nodecg);
  players(nodecg);
}
