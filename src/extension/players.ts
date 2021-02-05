import { v4 as uuid } from 'uuid';
import { Player } from '../nodecg/generated';
import { NodeCG } from './nodecg';
import clone from 'clone';

export const players = (nodecg: NodeCG): void => {

  const logger = new nodecg.Logger(`${nodecg.bundleName}:players`);

  const playersRep = nodecg.Replicant('players');
  const gameRep = nodecg.Replicant('game');

  const addPlayer = (name: string): boolean => {

    if (!playersRep.value || !gameRep.value) {
      return false;
    }

    if (!name) {
      return false;
    }

    if (playersRep.value.length === gameRep.value.rule.players) {
      return false;
    }

    const newPlayer: Player = {
      id: uuid(),
      name,
      thumbnail: null,
      discord: null,
      status: {
        rank: playersRep.value.length + 1,
        millions: 10
      },
    };

    playersRep.value.push(newPlayer);
    return true;
  }

  const editPlayer = (edit: Player): boolean => {

    if (!playersRep.value) {
      return false;
    }

    if (!edit.name) {
      return false;
    }

    const index = playersRep.value.findIndex(player => player.id = edit.id);
    if (index < 0) {
      return false;
    }

    playersRep.value[index] = Object.assign(
      {},
      playersRep.value[index],
      {
        name: edit.name
      }
    );

    return true;
  }

  const removePlayer = (id: string): boolean => {

    if (!playersRep.value) {
      return false;
    }

    playersRep.value = playersRep.value.filter(player => player.id !== id);

    return true;
  }

  const clearPlayer = (): boolean => {

    if (!playersRep.value) {
      return false;
    }

    playersRep.value = [];

    return true;
  }

  const settleMillions = (playerMillions: number[]): boolean => {

    if (!playersRep.value || playerMillions.length !== playersRep.value.length) {
      return false;
    }

    const floored = playerMillions.map(millions => Math.floor(millions));
    const sorted = clone(floored).sort((l, r) => { return r - l; });
    const ranks = floored.map((v) => {
      return sorted.indexOf(v) + 1;
    });

    playersRep.value = playersRep.value.map((player, index) => {
      return Object.assign({},
        player,
        {
          status: {
            rank: ranks[index],
            millions: floored[index],
          }
        }
      )
    });

    return true;
  }

  const resetSettlements = (): boolean => {

    if (!playersRep.value) {
      return false;
    }

    playersRep.value = playersRep.value.map((player) => {
      return Object.assign(
        {},
        player,
        {
          status: {
            rank: 1,
            millions: 10
          }
        }
      )
    });

    return true;
  }

  const reorderPlayers = (idOrders: string[]): boolean => {

    if (!playersRep.value || idOrders.length !== playersRep.value.length) {
      return false;
    }

    const ordered = playersRep.value.map((player) => {
      return idOrders.find(id => id === player.id);
    });

    if (ordered.includes(undefined)) {
      return false;
    }

    playersRep.value = playersRep.value.sort((l, r) => {
      return idOrders.indexOf(l.id) - idOrders.indexOf(r.id);
    });
    logger.info(`reorder players to: ${JSON.stringify(idOrders)}`);
    return true;
  }

  nodecg.listenFor('player:add-player', (data: string, cb) => {
    const result = addPlayer(data);

    if (cb && !cb.handled) {
      if (!result) {
        cb('プレイヤーの追加に失敗しました.');
      } else {
        cb(null);
      }
    }
  });

  nodecg.listenFor('player:edit-player', (data: Player, cb) => {
    const result = editPlayer(data);

    if (cb && !cb.handled) {
      if (!result) {
        cb('プレイヤー情報の編集に失敗しました.');
      } else {
        cb(null);
      }
    }
  });

  nodecg.listenFor('player:remove-player', (data: string, cb) => {
    const status = removePlayer(data);


    if (cb && !cb.handled) {
      if (!status) {
        cb('プレイヤーの削除に失敗しました.');
      } else {
        cb(null);
      }
    }
  });

  nodecg.listenFor('player:clear-player', (_, cb) => {
    clearPlayer();

    if (cb && !cb.handled) {
      cb(null);
    }
  });

  nodecg.listenFor('player:settle-millions', (data: number[], cb) => {
    const status = settleMillions(data);

    if (cb && !cb.handled) {
      if (!status) {
        cb('決算総資産の設定に失敗しました.');
      }
      cb(null);
    }
  });

  nodecg.listenFor('player:reorder-players', (data: string[], cb) => {
    reorderPlayers(data);

    if (cb && !cb.handled) {
      cb(null);
    }
  });

  nodecg.listenFor('game:reset', (_, cb) => {
    resetSettlements();

    if (cb && !cb.handled) {
      cb(null);
    }
  });

  logger.info('Initialize players extensions.');
}
