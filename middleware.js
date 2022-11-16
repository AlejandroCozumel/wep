import { NextResponse } from "next/server";

import { edgeVerifyToken } from "./services/auth.service"

export const config = {
  matcher: '/dashboard/:path*',
}

export default async function middleware(req) {
  const user = req.cookies.get('weptoken');
  if (!user) {
    return NextResponse.redirect(new URL('/', req.url))
  }
  const dataUser = JSON.parse(user)
  const token = dataUser.data.token;
  const verify = await edgeVerifyToken(token);

  if(!verify) {
    return NextResponse.redirect(new URL('/', req.url))
  }
  return NextResponse.next();
}
