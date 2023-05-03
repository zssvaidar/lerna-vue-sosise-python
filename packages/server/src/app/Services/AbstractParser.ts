import { spawn } from "child_process";

export default abstract class AbstractParser {

    protected async runSubProcess1(domainIds: number[]) {

        try {
            const convertResult = spawn(`../back/myenv/bin/python3`, [`../back/2_project_page_group_html_collector.py`, domainIds.join(',') ], {
                detached: true,
                stdio: 'ignore'
            });

            return 'process ran';
        } catch (error) {
            console.log(error);
        }

    }
}