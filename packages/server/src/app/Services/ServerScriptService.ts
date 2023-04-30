import { spawn } from "child_process";

export default class ServerScriptService {
    /**
     * Constructor
     */
    constructor() {
        // ...
    }

    public async runCrawlerForUrls(id: any): Promise<string> {
        const convertResult = spawn(`./myenv/bin/python3`, [`1_project_link_collector.py`, id ], {
            detached: true,
            stdio: 'ignore',
            cwd: `${process.cwd()}/../back`
        });

        return 'process ran';
    }

    public async runParserForGroups(id: any): Promise<string> {
        const convertResult = spawn(`./myenv/bin/python3`, [`2_project_page_group_collector.py`, id ], {
            detached: true,
            stdio: 'ignore',
            cwd: `${process.cwd()}/../back`
        });

        return 'process ran';
    }

    public async runParserForGroupUrlTags(id: any): Promise<string> {
        const convertResult = spawn(`./myenv/bin/python3`, [`3_project_group_html_tag_collector.py`, id ], {
            detached: true,
            stdio: 'ignore',
            cwd: `${process.cwd()}/../back`
        });

        return 'process ran';
    }
}