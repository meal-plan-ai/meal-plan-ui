import { NextResponse } from 'next/server';

/**
 * Handles cookies from a backend response and adds them to the Next.js response
 * @param response The Next.js response object
 * @param backendResponse The response from the backend API
 * @returns The updated Next.js response with cookies
 */
export function handleCookiesFromBackend(
  response: NextResponse,
  backendResponse: Response
): NextResponse {
  const setCookieHeader = backendResponse.headers.get('set-cookie');

  if (setCookieHeader) {
    const cookies = parseCookies(setCookieHeader);

    for (const [name, { value, options }] of Object.entries(cookies)) {
      if (name === 'token') {
        options.httpOnly = true;
      }
      console.log(`Setting cookie ${name} with options:`, options);
      response.cookies.set(name, value, options);
    }
  }

  return response;
}

/**
 * Handles cookies for logout specifically, clearing tokens if needed
 * @param response The Next.js response object
 * @param backendResponse The response from the backend API
 * @returns The updated Next.js response with cookies cleared
 */
export function handleLogoutCookies(
  response: NextResponse,
  backendResponse: Response
): NextResponse {
  const setCookieHeader = backendResponse.headers.get('set-cookie');

  const cookiesToClear = ['token', 'refreshToken', 'auth', 'session', 'user'];

  if (setCookieHeader) {
    const cookies = parseCookies(setCookieHeader);

    for (const [name, { value, options }] of Object.entries(cookies)) {
      console.log(`Setting logout cookie ${name} with options:`, options);

      if (name === 'token' || name.includes('auth') || name.includes('session')) {
        response.cookies.set(name, '', {
          expires: new Date(0),
          maxAge: 0,
          path: '/',
          httpOnly: true,
          sameSite: 'strict',
        });
      } else {
        response.cookies.set(name, value, options);
      }
    }
  }

  // Очищаем все куки из предопределенного списка, даже если их нет в ответе
  cookiesToClear.forEach(cookieName => {
    response.cookies.set(cookieName, '', {
      expires: new Date(0),
      maxAge: 0,
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
    });
  });

  return response;
}

/**
 * Parse a Set-Cookie header into a structured format
 * @param setCookieHeader The Set-Cookie header string
 * @returns An object mapping cookie names to values and options
 */
function parseCookies(setCookieHeader: string): Record<
  string,
  {
    value: string;
    options: {
      path?: string;
      maxAge?: number;
      expires?: Date;
      httpOnly?: boolean;
      secure?: boolean;
      sameSite?: 'strict' | 'lax' | 'none';
    };
  }
> {
  const result: Record<
    string,
    {
      value: string;
      options: {
        path?: string;
        maxAge?: number;
        expires?: Date;
        httpOnly?: boolean;
        secure?: boolean;
        sameSite?: 'strict' | 'lax' | 'none';
      };
    }
  > = {};

  // Split header by comma for multiple cookies
  const cookieStrings = setCookieHeader.split(',');

  for (const cookieStr of cookieStrings) {
    // Split the cookie string into parts
    const parts = cookieStr.split(';').map(part => part.trim());
    const nameValuePair = parts.shift() || '';
    const equalIndex = nameValuePair.indexOf('=');

    if (equalIndex === -1) continue;

    const name = nameValuePair.substring(0, equalIndex);
    const value = nameValuePair.substring(equalIndex + 1);

    console.log(`Parsing cookie: ${name}=${value}`);
    console.log(`Attributes: ${parts.join(', ')}`);

    // Parse attributes
    const options: {
      path?: string;
      maxAge?: number;
      expires?: Date;
      httpOnly?: boolean;
      secure?: boolean;
      sameSite?: 'strict' | 'lax' | 'none';
    } = {};

    for (const part of parts) {
      const [attrName, attrValue] = part.split('=').map(s => s.trim());
      const lowerAttrName = attrName.toLowerCase();

      if (lowerAttrName === 'max-age') {
        options.maxAge = Number(attrValue);
      } else if (lowerAttrName === 'expires') {
        options.expires = new Date(attrValue);
      } else if (lowerAttrName === 'path') {
        options.path = attrValue;
      } else if (lowerAttrName === 'httponly') {
        options.httpOnly = true;
      } else if (lowerAttrName === 'samesite') {
        const lowerSameSite = attrValue?.toLowerCase();
        if (lowerSameSite === 'strict' || lowerSameSite === 'lax' || lowerSameSite === 'none') {
          options.sameSite = lowerSameSite;
        }
      } else if (lowerAttrName === 'secure') {
        options.secure = true;
      }
    }

    // For token cookies, always enforce HttpOnly regardless of what the backend sent
    if (name === 'token') {
      options.httpOnly = true;
    }

    result[name] = { value, options };
  }

  return result;
}
