import { spawn } from "child_process";

export default class ServerScriptService {
    public async runCrawlerForUrls(id: any): Promise<string> {
        spawn(`./myenv/bin/python3`, [`1_project_link_collector.py`, id ], {
            detached: true,
            stdio: 'ignore',
            cwd: `${process.cwd()}/../back`
        });

        return 'process ran';
    }

    public async runParserForGroups(id: any): Promise<string> {
        spawn(`./myenv/bin/python3`, [`2_project_page_group_collector.py`, id ], {
            detached: true,
            stdio: 'ignore',
            cwd: `${process.cwd()}/../back`
        });

        return 'process ran';
    }

    public async runParserForGroupUrlTags(id: any): Promise<string> {
        spawn(`./myenv/bin/python3`, [`3_project_group_html_tag_collector.py`, id ], {
            detached: true,
            stdio: 'ignore',
            cwd: `${process.cwd()}/../back`
        });

        return 'process ran';
    }

    public async runParserForPageUrlTags(domainId: any, groupId: any): Promise<string> {
        spawn(`./myenv/bin/python3`, [`4_project_page_html_data_collector.py`, domainId, groupId ], {
            detached: true,
            stdio: 'ignore',
            cwd: `${process.cwd()}/../back`
        });

        return 'process ran';
    }

    public async runCalculatePageTagData(groupId: any): Promise<string> {
        spawn(`./myenv/bin/python3`, [`6_project_data_transform_update.py`, groupId ], {
            detached: true,
            stdio: 'ignore',
            cwd: `${process.cwd()}/../back`
        });

        spawn(`./myenv/bin/python3`, [`7_project_data_transform_text_filter_cleanup.py`], {
            detached: true,
            stdio: 'ignore',
            cwd: `${process.cwd()}/../back`
        });

        return 'process ran';
    }
}
