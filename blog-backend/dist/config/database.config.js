"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)("database", () => {
    let dbHost = "localhost";
    if (process.env.NODE_ENV === "production") {
        dbHost = "mongodb";
    }
    const dbUrl = `mongodb://${dbHost}:27017/blog_db`;
    return {
        url: process.env.DATABASE_URL || dbUrl,
    };
});
//# sourceMappingURL=database.config.js.map