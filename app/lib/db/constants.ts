import { NANOID_LENGTH, NANOID_SHORT_LENGTH } from "./nanoid";

export const AUTH_USER_TABLE_NAME = "auth_ethereum_session";
export const AUTH_KEY_TABLE_NAME = "auth_key";
export const AUTH_SESSION_TABLE_NAME = "auth_session";

export const ETH_ADDRESS_LENGTH = 42;
export const ETH_AUTH_ID_LENGTH = NANOID_LENGTH;
export const ETH_AUTH_NONCE_LENGTH = 96;

export const FILE_KEY_LENGTH = NANOID_SHORT_LENGTH;

export const MIN_USERNAME_LENGTH = 3;
export const MAX_USERNAME_LENGTH = 15;
