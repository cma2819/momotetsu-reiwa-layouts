import { NodeCG } from './nodecg';
import { NodeCG as NextNodeCG} from '../../../../types/server';
import axios from 'axios';
import { DiscordUser } from '../nodecg/generated/discordUser';
import express from 'express';

export const discord = (nodecg: NodeCG): void => {
  const logger = new nodecg.Logger(`${nodecg.bundleName}:discord`);

  const getAuthUri = (clientId: string, redirectUri: string): string => {
    return 'https://discord.com/api/oauth2/authorize'
      + `?response_type=code&client_id=${clientId}&scope=identify&redirect_uri=${redirectUri}&prompt=consent`;
  }

  const callbackAuth = async (clientId: string, clientSecret: string, code: string, redirectUri: string): Promise<DiscordUser> => {
    const data = {
      'client_id': clientId,
      'client_secret': clientSecret,
      'grant_type': 'authorization_code',
      'code': code,
      'redirect_uri': redirectUri,
      'scope': 'identify',
    };
    const query = new URLSearchParams(data);

    try {
      const response = await axios.post('https://discord.com/api/oauth2/token', query.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });

      const accessToken = response.data.access_token;

      const meResponse = await axios.get('https://discord.com/api/users/@me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      });

      return meResponse.data;
    } catch (e) {
      logger.warn('Failed to get discord authorization.');
      if (e.response) {
        logger.warn('Error response:' + JSON.stringify(e.response.data));
      } else {
        logger.warn('Error:' + e.message);
      }
      throw e;
    }
  }

  const app = express();
  app.get('/discord-callback', (req, res, _) => {

    if (
      !nodecg.bundleConfig.discord.useDiscordOAuth
      || !nodecg.bundleConfig.discord.clientSecret
      || !nodecg.bundleConfig.discord.clientId
      || !nodecg.bundleConfig.discord.redirectUri
    ) {
      res.send('Discord config is undefined.');
      return;
    }

    if (!req.query.code?.toString()) {
      res.send('Authorization Code is not found.');
      return;
    }

    callbackAuth(
      nodecg.bundleConfig.discord.clientId,
      nodecg.bundleConfig.discord.clientSecret,
      req.query.code.toString(),
      nodecg.bundleConfig.discord.redirectUri
    ).then((discord) => {
      logger.info(`Add discord player:${JSON.stringify(discord)}`);
      nodecg.sendMessage('player:add-discord-player', discord);
      res.send('Success to auth your discord user. Feel free to close this window!');
    }).catch(() => {
      res.send('Failed to get your discord user. Close this window and try again.');
    });

  });

  ((nodecg as any) as NextNodeCG).mount(`/${nodecg.bundleName}`, app);

  nodecg.listenFor('discord:auth-uri', (_, cb) => {
    if (
      !nodecg.bundleConfig.discord.useDiscordOAuth
      || !nodecg.bundleConfig.discord.clientId
      || !nodecg.bundleConfig.discord.redirectUri
    ) {
      logger.warn('Discord config is undefined.');
      if (cb && !cb.handled) {
        cb('Discord認証の設定が無効です.');
      }
      return;
    }

    const uri = getAuthUri(
      nodecg.bundleConfig.discord.clientId,
      nodecg.bundleConfig.discord.redirectUri
    );

    if (cb && !cb.handled) {
      cb(null, uri);
    }
  });

  logger.info('Initialize discord extensions.');
}
