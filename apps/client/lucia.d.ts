/* eslint-disable @typescript-eslint/ban-types */
/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("./lib/auth/lucia").Auth;
  type DatabaseUserAttributes = {
    username: string;
    address: string;
    avatarId: string;
  };
  type DatabaseSessionAttributes = {};
}
