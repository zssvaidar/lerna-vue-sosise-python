const authConfig = {
    /**
     * Project REST API api key
     */
    tokenExpire: Number(process.env.TOKEN_EXPIRES) * 1000,
    tokenSecret: String(process.env.TOKEN_SECRET),
};

export default authConfig;
