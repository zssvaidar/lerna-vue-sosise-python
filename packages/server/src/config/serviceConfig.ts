const serviceConfig = {
    /**
     * Redis connection
     */
    database: String(process.env.DB_PROJECT_CONNECTION)
};

export default serviceConfig;
