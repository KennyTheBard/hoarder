import * as dotenv from 'dotenv';
import { get } from 'env-var';


dotenv.config();

export const config: Config = {
    port: get('PORT').required().asPortNumber(),
    rethinkdb: {
        host: get('RETHINKDB_HOST').required().asString(),
        port: get('RETHINKDB_PORT').required().asPortNumber(),
        password: get('RETHINKDB_PASSWORD').required().asString(),
        database: get('RETHINKDB_DATABASE').required().asString(),
    },
    moviedbApi: {
        key: get('MOVIEDB_API_KEY').required().asString(),
    },
    omdbApi: {
        key: get('OMDB_API_KEY').required().asString(),
    },
    googleApi: {
        key: get('GOOGLE_API_KEY').required().asString(),
    },
};

export type Config = {
    port: number;
    rethinkdb: {
        host: string;
        port: number;
        password: string;
        database: string;
    };
    moviedbApi: ApiConfig;
    omdbApi: ApiConfig;
    googleApi: ApiConfig;
};

export type ApiConfig = {
    key: string;
};