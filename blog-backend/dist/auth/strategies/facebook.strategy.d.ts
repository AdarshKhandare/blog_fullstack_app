import * as PassportFacebook from "passport-facebook";
declare const FacebookStrategy_base: new (...args: any[]) => PassportFacebook.Strategy;
export declare class FacebookStrategy extends FacebookStrategy_base {
    constructor();
    validate(accessToken: string, refreshToken: string, profile: any, done: Function): Promise<any>;
}
export {};
