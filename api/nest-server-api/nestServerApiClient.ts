import axios from 'axios';
import { cookies } from 'next/headers';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const nestServerApiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

nestServerApiClient.interceptors.request.use(
  async config => {
    if (typeof window === 'undefined') {
      try {
        const cookieStore = await cookies();
        const tokenCookie = cookieStore.get('token');

        if (tokenCookie) {
          config.headers['Cookie'] = `token=${tokenCookie.value}`;
        } else {
          console.log('No token cookie found in Next.js store');
        }
      } catch (error) {
        console.error('Error accessing cookie store:', error);
      }
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

nestServerApiClient.interceptors.response.use(
  async response => {
    if (typeof window === 'undefined') {
      const setCookieHeaders = response.headers['set-cookie'];

      if (setCookieHeaders && Array.isArray(setCookieHeaders)) {
        try {
          const cookieStore = await cookies();
          let hasAuthTokenCookie = false;

          for (const cookieStr of setCookieHeaders) {
            const cookieParts = cookieStr.split(';').map(part => part.trim());
            const nameValuePair = cookieParts[0].split('=');
            const name = nameValuePair[0];
            const value = nameValuePair.slice(1).join('=');

            if (name === 'token' && value && value !== 'deleted') {
              hasAuthTokenCookie = true;
            }

            const options: {
              httpOnly?: boolean;
              secure?: boolean;
              path?: string;
              maxAge?: number;
              sameSite?: 'lax' | 'strict' | 'none';
              expires?: Date;
            } = {};
            if (cookieParts.includes('HttpOnly')) options.httpOnly = true;
            if (cookieParts.includes('Secure')) options.secure = true;

            for (const part of cookieParts) {
              if (part.toLowerCase().startsWith('path=')) {
                options.path = part.split('=')[1];
              } else if (part.toLowerCase().startsWith('max-age=')) {
                options.maxAge = parseInt(part.split('=')[1]);
              } else if (part.toLowerCase().startsWith('samesite=')) {
                options.sameSite = part.split('=')[1].toLowerCase() as 'lax' | 'strict' | 'none';
              } else if (part.toLowerCase().startsWith('expires=')) {
                options.expires = new Date(part.split('=')[1]);
              }
            }

            cookieStore.set(name, value, options);
          }

          if (
            (response.config.url?.startsWith('/auth/') && !hasAuthTokenCookie) ||
            response.config.url === '/auth/logout'
          ) {
            cookieStore.set('isAuthenticated', '', {
              httpOnly: false,
              expires: new Date(0),
              path: '/',
            });
          }
        } catch (error) {
          console.error('Error setting cookies from response:', error);
        }
      }
    }

    return response;
  },
  error => {
    if (error.response && error.response.status === 401) {
      if (typeof window === 'undefined') {
        cookies()
          .then(cookieStore => {
            cookieStore.set('token', '', {
              expires: new Date(0),
              path: '/',
            });
            cookieStore.set('isAuthenticated', '', {
              httpOnly: false,
              expires: new Date(0),
              path: '/',
            });
          })
          .catch(err => {
            console.error('Error clearing cookies on 401:', err);
          });
      } else {
        window.location.href = '/auth/login';
      }
    }

    return Promise.reject(error);
  }
);

export { nestServerApiClient };
