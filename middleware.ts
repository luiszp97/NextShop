import { NextResponse, type NextRequest } from "next/server";

import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const validUsers = ['admin', 'seo', 'super-user'];


    if (!session) {

        if (req.nextUrl.pathname.includes('/api')) {
            return new Response(JSON.stringify({ message: 'Debes estar autenticado' }), {
                status: 401,
                headers: {
                    'Content-Type': 'aplication/json'
                }
            });
        }

        const requestedPage = req.nextUrl.pathname;
        const url = req.nextUrl.clone();
        url.pathname = `/auth/login`;
        url.search = `p=${requestedPage}`;
        return NextResponse.redirect(url);

    }

    if (req.nextUrl.pathname.startsWith('/admin') && !validUsers.includes(session.user.role)) {
        return NextResponse.redirect(req.nextUrl.origin);
    }

    if (req.nextUrl.pathname.includes('/api/admin') && !validUsers.includes(session.user.role)) {
        return new Response(JSON.stringify({ message: 'No tienes los permisos necesarios' }), {
            status: 401,
            headers: {
                'Content-Type': 'aplication/json'
            }
        });
    }



    return NextResponse.next();
}

export const config = {
    matcher: ["/checkout/:path*", "/admin", "/api/admin/:path*"],
};