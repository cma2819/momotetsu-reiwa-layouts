import { Assets } from "./asset";
import { Game } from './generated/game';
import { Players } from './generated/players';

type ReplicantMap = {
  assets: Assets,
  'assets:background': Assets,
	game: Game,
	players: Players
};

export {
	Assets,
	Game,
	Players,
    ReplicantMap
};
