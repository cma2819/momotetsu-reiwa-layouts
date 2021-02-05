/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface Player {
	id: string;
	name: string;
	thumbnail: string | null;
	status: {
		rank: number;
		millions: number;
	};
	discord: null | {
		id: string;
		username: string;
		avatar: string;
		[k: string]: any;
	};
}
