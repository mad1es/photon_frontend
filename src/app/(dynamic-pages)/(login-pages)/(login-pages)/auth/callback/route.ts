import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { getServerAccessToken } from '@/utils/jwt-tokens-server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const next = requestUrl.searchParams.get('next');

  revalidatePath('/', 'layout');
  revalidatePath('/dashboard', 'layout');

  const token = await getServerAccessToken();
  if (!token) {
    return NextResponse.redirect(new URL('/login', requestUrl.origin));
  }

  let redirectTo = new URL('/dashboard', requestUrl.origin);

  if (next) {
    const decodedNext = decodeURIComponent(next);
    redirectTo = new URL(decodedNext, requestUrl.origin);
  }

  return NextResponse.redirect(redirectTo);
}
