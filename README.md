# Database V2

Hello, everyone. We are currently in the works of rewriting our [database](https://github.com/sparkyflight/database) submodule as it has several issues, and is not optimized for production environments. This new submodule is currently in pre development, and we moved from Sequelize to Prisma as it has better support for TypeScript and has been shown to be more optimized for large environments. This module will also come with global caching with Redis, to make our users experience even more consistent. This new database submodule will involve several breaking changes, as we are introducing the use of foreign keys, and relations between tables; allowing data to be processed even faster and more understandable than our existing implementation with [Database V1](https://github.com/sparkyflight/database).

> Warning
> This submodule is in pre development, and should **NOT** be used in production environments and is considered unstable.