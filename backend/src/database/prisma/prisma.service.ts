// // // import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
// // // import { PrismaClient } from '@prisma/client'
// // // import PrismaPg from '@prisma/adapter-pg'

// // // @Injectable()
// // // export class PrismaService
// // //     extends PrismaClient
// // //     implements OnModuleInit, OnModuleDestroy {

// // //     constructor() {
// // //         if (!process.env.DATABASE_URL) {
// // //             throw new Error('DATABASE_URL environment variable is not set')
// // //         }

// // //         const adapter = new PrismaPg({
// // //             connectionString: process.env.DATABASE_URL,
// // //         })

// // //         super({
// // //             adapter,
// // //             log: ['query', 'info', 'warn', 'error'], // optional but recommended
// // //             // adapter: 'prisma-data-proxy'
// // //             // accelerateUrl: process.env.PRISMA_ACCELERATE_URL,
// // //         });
// // //     }


// // //     async onModuleInit() {
// // //         await this.$connect();

// // //         const db = await this.$queryRawUnsafe(
// // //             `SELECT current_database(), current_schema()`
// // //         );
// // //     }

// // //     async onModuleDestroy() {
// // //         await this.$disconnect();
// // //     }

// // //     async enableShutdownHooks() {
// // //         (this as any).$on('beforeExit' as const, async () => {
// // //             await this.$disconnect()
// // //         })
// // //     }
// // // }



// // import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
// // import { PrismaClient } from '@prisma/client'
// // import PrismaPgAdapter from '@prisma/adapter-pg'

// // @Injectable()
// // export class PrismaService
// //   extends PrismaClient
// //   implements OnModuleInit, OnModuleDestroy {

// //   constructor() {
// //     if (!process.env.DATABASE_URL) {
// //       throw new Error('DATABASE_URL environment variable is not set')
// //     }

// //     const adapter = new PrismaPgAdapter({
// //       connectionString: process.env.DATABASE_URL,
// //     })

// //     super({
// //       adapter,
// //       log: ['query', 'info', 'warn', 'error'],
// //     })
// //   }

// //   async onModuleInit() {
// //     await this.$connect()
// //   }

// //   async onModuleDestroy() {
// //     await this.$disconnect()
// //   }
// // }


// import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
// import { PrismaClient } from '@prisma/client'
// import { createPgAdapter  } from '@prisma/adapter-pg'

// @Injectable()
// export class PrismaService
//   extends PrismaClient
//   implements OnModuleInit, OnModuleDestroy {

//   constructor() {
//     if (!process.env.DATABASE_URL) {
//       throw new Error('DATABASE_URL environment variable is not set')
//     }

//     const adapter = new createPgAdapter({
//       connectionString: process.env.DATABASE_URL,
//     })

//     super({
//       adapter,
//       log: ['query', 'info', 'warn', 'error'],
//     })
//   }

//   async onModuleInit() {
//     await this.$connect()
//   }

//   async onModuleDestroy() {
//     await this.$disconnect()
//   }
// }

// import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
// import { PrismaClient } from '@prisma/client'

// @Injectable()
// export class PrismaService
//   extends PrismaClient
//   implements OnModuleInit, OnModuleDestroy {

//   constructor() {
//     if (!process.env.DATABASE_URL) {
//       throw new Error('DATABASE_URL environment variable is not set')
//     }

//     super({
//       log: ['query', 'info', 'warn', 'error'],
//     //   engine: 'binary', // <- FORCE classic engine
//     })
//   }

//   async onModuleInit() {
//     await this.$connect()
//   }

//   async onModuleDestroy() {
//     await this.$disconnect()
//   }
// }


// import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
// import { PrismaClient } from '@prisma/client';
// import { PrismaPg } from "@prisma/adapter-pg";
// import { Pool } from "pg";
// // import { PrismaPgAdapter } from '@prisma/adapter-pg';

// @Injectable()
// export class PrismaService
//     extends PrismaClient
//     implements OnModuleInit, OnModuleDestroy {
//     constructor() {
//         if (!process.env.DATABASE_URL) {
//             throw new Error('DATABASE_URL environment variable is not set');
//         }

//         const pool = new Pool({
//             connectionString: process.env.DATABASE_URL,
//         });

//         // const adapter = new PrismaPgAdapter({
//         //     connectionString: process.env.DATABASE_URL,
//         // });
//         const adapter = new PrismaPg(pool);

//         // const prisma = new PrismaClient({
//         //     adapter,
//         // });

//         super({
//             adapter,
//             log: ['query', 'info', 'warn', 'error'], // optional but recommended
//         });
//     }

//     async onModuleInit() {
//         await this.$connect();
//     }

//     async onModuleDestroy() {
//         await this.$disconnect();
//     }

//     async enableShutdownHooks() {
//         // this.$on('beforeExit', async () => {
//         //   await this.$disconnect();
//         // });
//         (this as any).$on('beforeExit' as const, async () => {
//             await this.$disconnect()
//         })
//     }
// }


import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {

    private readonly pool: Pool;

    constructor() {
        if (!process.env.DATABASE_URL) {
            throw new Error('DATABASE_URL environment variable is not set');
        }

        const pool = new Pool({
            connectionString: process.env.DATABASE_URL,
        });

        const adapter = new PrismaPg(pool);

        super({
            adapter,
            log: ['query', 'info', 'warn', 'error'],
        });

        this.pool = pool;
    }

    async onModuleInit() {
        await this.$connect();
        const db = await this.$queryRawUnsafe(
            `SELECT current_database(), current_schema()`
        );
        console.log("CONNECTED TO:", db);
    }

    async onModuleDestroy() {
        await this.$disconnect();
        await this.pool.end();
    }
}