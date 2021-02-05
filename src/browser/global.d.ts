import {
  CreateNodecgInstance,
  CreateNodecgConstructor
} from 'ts-nodecg/browser';
// import { Configschema } from "../nodecg/generated/configschema";
import { ReplicantMap } from '../nodecg/replicants';
import { MessageMap } from '../nodecg/messages';

declare global {
  const nodecg: CreateNodecgInstance<
    'ome-speedrun-layout',
    {},
    ReplicantMap,
    MessageMap
  >;
  const NodeCG: CreateNodecgConstructor<
    'ome-speedrun-lalyout',
    {},
    ReplicantMap,
    MessageMap
  >;
}
