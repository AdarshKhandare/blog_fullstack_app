import { Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async validateGoogleUser(profile: any) {
    this.logger.log(`Google profile: ${JSON.stringify(profile, null, 2)}`);

    // Extract proper values - Google returns profile info differently than our expectations
    const googleId = profile.id || profile.sub;
    const email = profile.email || (profile.emails && profile.emails[0]?.value);
    const name =
      profile.displayName ||
      profile.name ||
      (profile.firstName && profile.lastName
        ? `${profile.firstName} ${profile.lastName}`
        : email.split("@")[0]);

    if (!googleId || !email) {
      throw new Error("Invalid Google profile data");
    }

    try {
      // Find user by googleId
      let user = await this.prisma.user.findUnique({
        where: { googleId },
      });
      console.log("user", user);
      // If user not found by googleId, try by email
      if (!user) {
        user = await this.prisma.user.findUnique({
          where: { email },
        });

        // If user exists with email but no googleId, update the googleId
        if (user) {
          try {
            user = await this.prisma.user.update({
              where: { id: user.id },
              data: { googleId },
            });
          } catch (error) {
            this.logger.error(
              `Failed to update user with googleId: ${error.message}`
            );
            // Still return the user even if update fails
          }
        } else {
          // Create a new user if none exists
          try {
            user = await this.prisma.user.create({
              data: {
                email,
                name,
                googleId,
              },
            });
          } catch (error) {
            this.logger.error(`Failed to create user: ${error.message}`);

            // Fallback - try creating user without googleId if that's causing issues
            if (error.code === "P2002") {
              // Unique constraint violation
              try {
                user = await this.prisma.user.create({
                  data: {
                    email,
                    name,
                  },
                });

                // Try to update with googleId after
                await this.prisma.user.update({
                  where: { id: user.id },
                  data: { googleId },
                });
              } catch (secondError) {
                this.logger.error(
                  `Failed in fallback user creation: ${secondError.message}`
                );
                throw secondError;
              }
            } else {
              throw error;
            }
          }
        }
      }

      return user;
    } catch (error) {
      this.logger.error(`Error in validateGoogleUser: ${error.message}`);
      throw error;
    }
  }

  async validateFacebookUser(profile: any) {
    this.logger.log(`Facebook profile: ${JSON.stringify(profile, null, 2)}`);

    const facebookId = profile.id;
    const email = profile.emails?.[0]?.value || `${facebookId}@facebook.com`;
    const name =
      profile.displayName ||
      (profile.name
        ? `${profile.name.givenName} ${profile.name.familyName}`
        : email.split("@")[0]);

    if (!facebookId) {
      throw new Error("Invalid Facebook profile data");
    }

    try {
      // Find user by facebookId
      let user = await this.prisma.user.findUnique({
        where: { facebookId },
      });

      // If user not found by facebookId, try by email
      if (!user) {
        user = await this.prisma.user.findUnique({
          where: { email },
        });

        // If user exists with email but no facebookId, update the facebookId
        if (user) {
          try {
            user = await this.prisma.user.update({
              where: { id: user.id },
              data: { facebookId },
            });
          } catch (error) {
            this.logger.error(
              `Failed to update user with facebookId: ${error.message}`
            );
            // Still return the user even if update fails
          }
        } else {
          // Create a new user if none exists
          try {
            user = await this.prisma.user.create({
              data: {
                email,
                name,
                facebookId,
              },
            });
          } catch (error) {
            this.logger.error(`Failed to create user: ${error.message}`);

            // Fallback - try creating user without facebookId if that's causing issues
            if (error.code === "P2002") {
              // Unique constraint violation
              try {
                user = await this.prisma.user.create({
                  data: {
                    email,
                    name,
                  },
                });

                // Try to update with facebookId after
                await this.prisma.user.update({
                  where: { id: user.id },
                  data: { facebookId },
                });
              } catch (secondError) {
                this.logger.error(
                  `Failed in fallback user creation: ${secondError.message}`
                );
                throw secondError;
              }
            } else {
              throw error;
            }
          }
        }
      }

      return user;
    } catch (error) {
      this.logger.error(`Error in validateFacebookUser: ${error.message}`);
      throw error;
    }
  }

  async generateToken(user: any) {
    this.logger.log(`Generating token for user: ${user.id}`);
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
