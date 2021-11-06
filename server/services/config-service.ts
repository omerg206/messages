import config from "../assets/config.json";

export interface Config {
    mongoUrl: string;
    expressPort: number;
    minTimeoutSendMessageRange: number,
    maxTimeoutSendMessageRange: number
}


class ConfigService {
    readonly _config: Config;

    constructor() {
        this._config = config;
    }


    get config(): Config {
        return this._config
    }

    getConfigByKey(key: keyof Config) {
        return this._config[key];
    }

}

export const configService: ConfigService = Object.freeze(new ConfigService());