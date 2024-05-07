/* eslint-disable @typescript-eslint/ban-types */
/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("./lib/auth/lucia").Auth;
  type DatabaseUserAttributes = {
    twitterUsername: string | null;
    username: string;
    address: string;
    avatarId: string | null;
  };
  type DatabaseSessionAttributes = {};
}
