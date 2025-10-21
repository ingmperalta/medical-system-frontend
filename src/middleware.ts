// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Lista de rutas protegidas
const protectedRoutes = ['/prescriptions'];

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get('token'); // O el nombre de tu cookie/token  

  console.log('isLoggedIn>>',isLoggedIn)
  const { pathname } = request.nextUrl;

  if (protectedRoutes.some(route => pathname.startsWith(route))) 
  {
    // if (!isLoggedIn) 
    // {
    //   const loginUrl = new URL('/login', request.url);
    //   return NextResponse.redirect(loginUrl);
    // }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/prescriptions',
  ], // Define qué rutas deben pasar por el middleware
};
