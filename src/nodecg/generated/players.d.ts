/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Players = {
	id: string;
	name: string;
	thumbnail: string | null;
	status: {
		rank: number;
		kiloYens: number;
	};
	discord: null | {
		id: string;
		username: string;
		discriminator?: string;
		avatar: string;
		[k: string]: any;
	};
}[];
