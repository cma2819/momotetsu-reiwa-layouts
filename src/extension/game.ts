import { v4 as uuid } from 'uuid';
import { Goal, PoorType, Rule } from '../nodecg/generated';
import { Game } from '../nodecg/replicants';
import { NodeCG } from './nodecg';
import { validationRule } from './validation';

export const game = (nodecg: NodeCG): void => {

  const logger = new nodecg.Logger(`${nodecg.bundleName}:game`);

  const defaultGame: Game = {
    rule: {
      players: 0,
      years: 0,
      isDuel: false,
    },
    status: {
      year: 0,
      month: 0,
      settleYear: 0,
      goal: {
        name: '東京',
        isCardShop: false,
      },
      poor: null,
    }
  };
  const gameRep = nodecg.Replicant('game', { defaultValue: defaultGame });
  const playersRep = nodecg.Replicant('players', {
    defaultValue: [
      {
        id: uuid(),
        name: 'example player',
        thumbnail: null,
        status: {
          rank: 1,
          millions: 10
        },
        discord: null
      },
    ]
  });

  const editRule = (rule: Rule): boolean => {

    if (!gameRep.value || !playersRep.value) {
      return false;
    }

    if (!validationRule(rule)) {
      logger.warn(`Failed to validation for game.rule: ${JSON.stringify(rule)}.`);
      return false;
    }

    gameRep.value.rule = Object.assign(
      {},
      rule,
      {
        players: Math.floor(rule.players),
        years: Math.floor(rule.years),
      }
    );
    playersRep.value = playersRep.value.filter((_, index) => {
      return index < rule.players;
    });

    logger.info(`game rule changed to ${JSON.stringify(rule)}`);

    return true;
  }

  const resetStatus = (): void => {

    if (!gameRep.value) {
      return;
    }

    gameRep.value.status = {
      year: 0,
      month: 0,
      settleYear: 0,
      goal: {
        name: '東京',
        isCardShop: false,
      },
      poor: null,
    };

    logger.info('game status is reset.');

  }

  const nextMonth = (): boolean => {

    if (!gameRep.value) {
      return false;
    }

    const newMonth = (gameRep.value.status.month + 1) % 12;
    const newYear = (gameRep.value.status.month == 11)
      ? gameRep.value.status.year + 1 : gameRep.value.status.year;

    // newYear == rule.years means complete the game.
    if (!(newYear < gameRep.value.rule.years)) {
      return false;
    }

    gameRep.value.status = Object.assign({},
      gameRep.value.status,
      { year: newYear, month: newMonth }
    );

    return true;
  }

  const prevMonth = (): boolean => {

    if (!gameRep.value) {
      return false;
    }

    const newMonth = ((gameRep.value.status.month - 1) + 12) % 12;
    const newYear = (gameRep.value.status.month == 0)
      ? gameRep.value.status.year - 1 : gameRep.value.status.year;

    if (newYear < 0) {
      return false;
    }

    gameRep.value.status = Object.assign({},
      gameRep.value.status,
      { year: newYear, month: newMonth }
    );

    return true;
  }

  const changePoor = (type: PoorType): boolean => {

    if (!gameRep.value) {
      return false;
    }

    if (gameRep.value.status.poor === null) {

      gameRep.value.status.poor = {
        with: 0,
        type
      };

      return true;
    }

    gameRep.value.status.poor.type = type;

    return true;
  }

  const leavePoor = (): boolean => {

    if (!gameRep.value) {
      return false;
    }

    gameRep.value.status.poor = null;

    return true;
  }

  const poorTo = (player: number): boolean => {

    if (!gameRep.value || !gameRep.value.status.poor) {
      return false;
    }

    if (!(gameRep.value.rule.players > player)) {
      return false;
    }

    gameRep.value.status.poor.with = player;
    logger.info(`Poor go with Player:${player}`);

    return true;
  }

  const settlement = (year: number): boolean => {

    if (!gameRep.value) {
      return false;
    }

    if (year > gameRep.value.rule.years) {
      return false;
    }
    gameRep.value.status.settleYear = year;

    return true;
  }

  const setGoal = (goal: Goal): boolean => {

    if (!gameRep.value) {
      return false;
    }

    gameRep.value.status.goal = goal;

    return true;
  }

  nodecg.listenFor('game:reset', (_, cb) => {
    resetStatus();

    if (cb && !cb.handled) {
      cb(null);
    }
  })

  nodecg.listenFor('game:next-month', (_, cb) => {
    nextMonth();

    if (cb && !cb.handled) {
      cb(null);
    }
  });

  nodecg.listenFor('game:prev-month', (_, cb) => {
    prevMonth();

    if (cb && !cb.handled) {
      cb(null);
    }
  });

  nodecg.listenFor('game:change-poor', (data: PoorType, cb) => {
    changePoor(data);

    if (cb && !cb.handled) {
      cb(null);
    }
  });

  nodecg.listenFor('game:leave-poor', (_, cb) => {
    leavePoor();

    if (cb && !cb.handled) {
      cb(null);
    }
  })

  nodecg.listenFor('game:poor-to', (player: number, cb) => {
    poorTo(player);

    if (cb && !cb.handled) {
      cb(null);
    }
  })

  nodecg.listenFor('game:settlement', (data, cb) => {
    settlement(data);

    if (cb && !cb.handled) {
      cb(null);
    }
  });

  nodecg.listenFor('game:edit-rule', (data: Rule, cb) => {

    const status = editRule(data);

    if (cb && !cb.handled) {
      if (!status) {
        cb('ゲームルールの更新に失敗しました.')
      }
      cb(null);
    }
  });

  nodecg.listenFor('game:set-goal', (data, cb) => {
    setGoal(data);

    if (cb && !cb.handled) {
      cb(null);
    }
  })

  logger.info('Initialize game extensions.');
}
