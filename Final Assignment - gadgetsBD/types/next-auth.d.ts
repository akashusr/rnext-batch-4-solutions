import 'next-auth';

declare module 'next-auth' {
    interface User {
        id: string;
        userType?: 'customer' | 'shopOwner';
        shopId?: string;
    }

    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            userType: 'customer' | 'shopOwner';
            shopId?: string;
        };
        accessToken?: string;
        refreshToken?: string;
        accessTokenExpires?: number;
        error?: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        userType?: 'customer' | 'shopOwner';
        shopId?: string;
        image?: string | null;
        accessToken?: string;
        refreshToken?: string;
        accessTokenExpires?: number;
        refreshTokenExpires?: number;
        error?: string;
    }
}
