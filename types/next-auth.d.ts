import NextAuth from 'next-auth';
import { JWT } from "next-auth/jwt";

declare module 'next-auth' {
    interface Session {
        accessToken?: string;
        user: {
            role?: string;
            _id?: string;
            name?: string;
            email?: string;
        };
    }
}


// declare module "next-auth/jwt" {
//     /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
//     interface JWT {
//         accessToken?: string;
//     }
// }

