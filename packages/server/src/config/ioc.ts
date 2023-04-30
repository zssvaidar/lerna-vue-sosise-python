import UserRepository from "../app/Repositories/UserRepository";
import CrawlerService from "../app/Services/CrawlerService";
import InfoParserService from "../app/Services/InfoParserService";
import MainService from "../app/Services/MainService";
import ServerScriptService from "../app/Services/ServerScriptService";
import UserService from "../app/Services/UserService";

/**
 * IOC Config, please register here your services
 */
const iocConfig = {
    /**
     * Singleton services
     *
     * How to register:
     * YourServiceName: () => new YourServiceName()
     *
     * How to use:
     * const logger = IOC.makeSingleton(LoggerService) as LoggerService;
     */
    singletons: {},

    /**
     * Non singleton services
     *
     * How to register:
     * YourServiceName: () => new YourServiceName()
     *
     * How to use:
     * const logger = IOC.make(LoggerService) as LoggerService;
     */
    nonSingletons: {
        UserService: () => new UserService(new UserRepository()),
        MainService: () => new MainService(),
        CrawlerService: () => new CrawlerService(),
        InfoParserService: () => new InfoParserService(),
        ServerScriptService: () => new ServerScriptService()
        /**
         * This service is included in the core out of the box
         * If you want to override LoggerService just uncomment this code and import all necessary modules
         */
        // LoggerService: () => {
        //     if (process.env.APP_ENV === 'local') {
        //         return new LoggerService(new LoggerPrettyConsoleRepository());
        //     }
        //     return new LoggerService(new LoggerJsonConsoleRepository());
        // }
    },
};

export default iocConfig;
