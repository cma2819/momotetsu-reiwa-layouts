import { DiscordUser, Goal, Player, PoorType, Rule } from './generated';

export type MessageMap = {
  'game:edit-rule': { data: Rule };
  'game:next-month': {};
  'game:prev-month': {};
  'game:reset': {};
  'game:change-poor': { data: PoorType };
  'game:leave-poor': {};
  'game:poor-to': { data: number };
  'game:settlement': { data:number };
  'game:set-goal': { data: Goal };

  'player:add-player': { data: string };
  'player:add-discord-player': { data: DiscordUser };
  'player:edit-player': { data: Player };
  'player:remove-player': { data: string };
  'player:clear-player': {};
  'player:settle-kilo-yens': { data: number[] };
  'player:reorder-players': { data: string[] };

  'discord:auth-uri': { result: string, error: string };
};
