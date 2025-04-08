import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import * as PassportFacebook from "passport-facebook";

@Injectable()
export class FacebookStrategy extends PassportStrategy(
  PassportFacebook.Strategy,
  "facebook"
) {
  constructor() {
    super({
      clientID: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
      callbackURL: process.env.FACEBOOK_CALLBACK_URL || "",
      profileFields: ["id", "emails", "name", "photos"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function
  ): Promise<any> {
    try {
      const user = {
        id: profile.id,
        email: profile.emails?.[0]?.value,
        displayName: profile.displayName,
        firstName: profile.name?.givenName,
        lastName: profile.name?.familyName,
        picture: profile.photos?.[0]?.value,
        accessToken,
      };

      console.log("Facebook profile:", profile);
      done(null, user);
    } catch (error) {
      done(error, undefined);
    }
  }
}
