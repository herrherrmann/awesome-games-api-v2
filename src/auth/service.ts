import axios from "axios";
import { dataSource } from "../data-source.ts";
import { AuthInfo } from "../entities/AuthInfo.ts";
import { IsNull, Not } from "typeorm";

type TwitchAuthResult = {
    access_token: string;
    /**
     * Time in seconds.
     */
    expires_in: number;
    token_type: string;
};

type AuthHeaders = {
    "Client-ID": string;
    Authorization: string;
};

const authRepository = dataSource.getRepository(AuthInfo);

export async function getAuthHeaders(): Promise<AuthHeaders> {
    const existingAuth = await authRepository.findOne({
        where: {
            authToken: Not(IsNull()),
        },
    });
    if (!existingAuth || !isAuthValid(existingAuth)) {
        console.info("🔐 Getting new auth info from Twitch.");
        const requestDate = new Date();
        const newAuth = await authenticateViaTwitch(
            process.env.TWITCH_CLIENT_ID!,
            process.env.TWITCH_CLIENT_SECRET!,
        );
        if (existingAuth) {
            await authRepository.remove(existingAuth);
        }
        requestDate.setSeconds(requestDate.getSeconds() + newAuth.expires_in);
        await authRepository.save({
            authToken: newAuth.access_token,
            expiryDate: requestDate.toISOString(),
        });
        return tokenToAuthHeaders(newAuth.access_token);
    }
    return tokenToAuthHeaders(existingAuth.authToken);
}

function tokenToAuthHeaders(token: string): AuthHeaders {
    return {
        "Client-ID": process.env.TWITCH_CLIENT_ID!,
        Authorization: `Bearer ${token}`,
    };
}

function isAuthValid(authInfo: AuthInfo): boolean {
    const now = new Date();
    return !!authInfo && now < new Date(authInfo.expiryDate);
}

async function authenticateViaTwitch(
    clientId: string,
    clientSecret: string,
): Promise<TwitchAuthResult> {
    const { data } = await axios.post<TwitchAuthResult>(
        `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
    );
    return data;
}
