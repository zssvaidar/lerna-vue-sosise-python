import BaseSchema from 'sosise-core/build/Database/BaseSchema';
import * as faker from 'faker';
import Helper from "sosise-core/build/Helper/Helper";

/**
 * If you need more information, see: http://knexjs.org/#Schema ; https://www.npmjs.com/package/faker
 */
export default class SearchFilterAndGroup extends BaseSchema {
    /**
     * Restrict running the seed only in a local environment (APP_ENV=local)
     */
    protected onlyInLocalEnvironment = false;

    /**
     * Table name where data should be inserted in
     */
    protected tableName1 = 'search_filter';
    protected tableName2 = 'info_group';
    protected tableName3 = 'info_by_group';

    /**
     * Run seed
     */
    public async run(): Promise<void> {
        // Prepare data to seed
        const data: any = [
            {name: 'Пойск по имени'},
            {name: 'Пойск по датам'},
            {name: 'Пойск по специальности'},
            {name: 'Пойск по университету'},
            {name: 'Пойск по городу'}
        ];

        // Insert to table
        await this.dbConnection.table('search_filter').insert(data);

        const data1: any = [
            {
                domain: 'http://www.vestnik.nauka.kz/', 
                url: 'some_data', 
                type: 'some_data'
            },
                {
                    domain: 'https://journal.iitu.edu.kz/',
                    url: 'https://journal.iitu.edu.kz/index.php/ijict/article/view/284', 
                    type: 'some_data'
                }, // Акнур Ембердиева
                {
                    domain: 'https://journal.iitu.edu.kz/',
                    url: 'https://journal.iitu.edu.kz/index.php/ijict/article/view/285', 
                    type: 'some_data'
                }, // Динара Жолжанова, Рысхан Сатыбалдиева
                {
                    domain: 'https://journal.iitu.edu.kz/',
                    url: 'https://journal.iitu.edu.kz/index.php/ijict/article/view/286', 
                    type: 'some_data'
                }, // Куралай Иманалиева, Леонид Ким, Лаура Алимжанова
                {
                    domain: 'https://journal.iitu.edu.kz/',
                    url: 'https://journal.iitu.edu.kz/index.php/ijict/article/view/287', 
                    type: 'some_data'
                }, // Райхан Мурат, Галина Пащенко
                {
                    domain: 'https://journal.iitu.edu.kz/',
                    url: 'https://journal.iitu.edu.kz/index.php/ijict/article/view/288', 
                    type: 'some_data'
                }, // Анель Мухамеджанова, Галина Пащенко
                {
                    domain: 'https://journal.iitu.edu.kz/',
                    url: 'https://journal.iitu.edu.kz/index.php/ijict/article/view/289', 
                    type: 'some_data'
                }, // С.Б. Рахметулаева, А.К. Кульбаева
                    {
                        domain: 'https://sj.astanait.edu.kz/', 
                        url: 'http://journal.astanait.edu.kz/index.php/ojs/article/view/67', 
                        type: 'some_data'
                    },
                    {
                        domain: 'https://sj.astanait.edu.kz/', 
                        url: 'http://journal.astanait.edu.kz/index.php/ojs/article/view/51', 
                        type: 'some_data'
                    },
                    {
                        domain: 'https://sj.astanait.edu.kz/', 
                        url: 'http://journal.astanait.edu.kz/index.php/ojs/article/view/52', 
                        type: 'some_data'
                    },
                    {
                        domain: 'https://sj.astanait.edu.kz/', 
                        url: 'http://journal.astanait.edu.kz/index.php/ojs/article/view/57', 
                        type: 'some_data'
                    },
                    {
                        domain: 'https://sj.astanait.edu.kz/', 
                        url: 'http://journal.astanait.edu.kz/index.php/ojs/article/view/62', 
                        type: 'some_data'
                    },
                    {
                        domain: 'https://sj.astanait.edu.kz/', 
                        url: 'http://journal.astanait.edu.kz/index.php/ojs/article/view/68', 
                        type: 'some_data'
                    },
            {
                domain: 'https://bb.kaznu.kz/', 
                url: 'some_data', 
                type: 'some_data'
            },
            {
                domain: 'https://vestnik.aues.kz/', 
                url: 'some_data', 
                type: 'some_data'
            },
            {
                domain: 'https://bulbio.enu.kz/ ', 
                url: 'some_data', 
                type: 'some_data'
            },
            {
                domain: 'https://vestnik.kbtu.edu.kz/', 
                url: 'some_data',  
                type: 'some_data'
            },
        ];

        await this.dbConnection.table('info_group').insert(data1);

        // Prepare data to seed
        const data2: { infoId?: number, filter_id: number, group_id: number, value: string, data?: { authors: string[], keywords: string[], short_abstract: string,published: string , meta: {[key: string]: any}[] }}[] = [
            {
                filter_id: 4,
                group_id: 2,
                value: 'IITU',
                data: {
                    authors: [ 'Акнур Ембердиева' ],
                    keywords: [ 'автоматическая рассылка', 'Business Process Model and Notation', 'функция оповещений', 'база данных'],
                    short_abstract: 'В данной статье рассмотрена и разработана процесс автоматической рассылки оповещений студентам и родителям в организации образования на примере университета АО «МУИТ». Под рассылками оповещений подразумеваются такие функции, как: отправка  оповещений студентам и родителям о начале рубежных недель и о начале сессий, оповещения о неудачной сдаче рубежных контрольных или экзаменов, оповещения о пересдачах или о переобучение предмета в летнее время.',
                    published: '2022-05-03',
                    meta: [{ раздел: 'интеллектуальные системы' }]
                }
            },
            {
                filter_id: 4,
                group_id: 3,
                value: 'IITU',
                data: {
                    authors: [ 'Динара Жолжанова, Рысхан Сатыбалдиева' ],
                    keywords: [ 'форсайт', 'научно-техническое прогнозирование', 'глобально-конкурентоспособный университет', 'сценарии', 'технологии', 'будущее'],
                    short_abstract: 'В статье рассматривается актуальность развития системы форсайта, анализируются зарубежные и отечественные примеры создания системы прогнозирования научнотехнологического направления с учетом роли прогнозирования в системе управления университетами. ',
                    published: '2022-05-03',
                    meta: [{ раздел: 'интеллектуальные системы' }]
                }
            },
            {
                filter_id: 4,
                group_id: 4,
                value: 'IITU',
                data: {
                    authors: [ 'Куралай Иманалиева, Леонид Ким, Лаура Алимжанова' ],
                    keywords: [ 'ретаргетинг', 'таргетинг', 'маркетинг', 'поведенческий ретаргетинг', 'поисковой ретаргетинг', 'сайт'],
                    short_abstract: 'С каждым годом объем маркетинговых данных растет, также растет количество различных маркетинговых приемов, которые в свою очередь помогают специалистам реализовывать эффективные рекламные кампании, направленные на привлечение внимания потребителя. Существуют различные маркетинговые приемы в рекламных компаниях. ',
                    published: '2022-05-03',
                    meta: [{ раздел: 'интеллектуальные системы' }]
                }
            },
            {
                filter_id: 4,
                group_id: 5,
                value: 'IITU',
                data: {
                    authors: [ 'Райхан Мурат, Галина Пащенко' ],
                    keywords: [ 'инвентаризация оборудования', 'информационная система'],
                    short_abstract: 'В данной статье рассматриваются существующие информационные системы и программы для инвентаризации оборудования, и выделяются особенности данных систем.',
                    published: '2022-05-03',
                    meta: [{ раздел: 'интеллектуальные системы' }]
                }
            },
            {
                filter_id: 4,
                group_id: 6,
                value: 'IITU',
                data: {
                    authors: [ 'Анель Мухамеджанова, Галина Пащенко' ],
                    keywords: [ 'качество образования', 'качество дистанционного обучения', 'деятельность образовательного учреждения', 'система оценивания результатов обучения', 'уровень компетентности обучающихся', 'автоматизированная система управления', 'математический метод'],
                    short_abstract: 'В статье рассмотрены некоторые аспекты построения системы оценки качества дистанционного обучения и рассмотрены основные группы показателей качества.',
                    published: '2022-05-03',
                    meta: [{ раздел: 'интеллектуальные системы' }]
                }
            },
            {
                filter_id: 4,
                group_id: 7,
                value: 'IITU',
                data: {
                    authors: [ 'С.Б. Рахметулаева, А.К. Кульбаева' ],
                    keywords: [ 'дерево решений', 'физиологические измерения', 'электронные медицинские записи (змк)', 'машинное обучение', 'точность' ],
                    short_abstract: 'Контролируемые алгоритмы машинного обучения стали основным инструментом для извлечения данных. Использование медицинских данных для диагностики заболеваний недавно выявило возможное применение этих технологий.',
                    published: '2022-05-03',
                    meta: [{ раздел: 'интеллектуальные системы' }]
                }
            },
                {
                    filter_id: 4,
                    group_id: 8,
                    value: 'Astana IT',
                    data: {
                        authors: [ 'Bekzhan Kerimkhan', 'Аinur Zhumadillayeva', 'Alexander Nedzvedz', ],
                        keywords: [ 'dynamic object analysis', 'dynamic objects', 'types of movement', 'space images' ],
                        short_abstract: 'Basic elements of changes on the multi-temporal satellite image and their basic sets of dynamic objects are formulated and defined, for which the main characteristics define the dynamic object as an area of motion. Such dependents of objects are inherited not only between objects and their dynamic groups.',
                        published: '2022-09-30',
                        meta: [{ issue: '2022: Volume 11', section: 'articles' }]
                    }
                },
                // {
                //     filter_id: 4,
                //     group_id: 9,
                //     value: 'Astana IT'
                // },
                // {
                //     filter_id: 4,
                //     group_id: 10,
                //     value: 'Astana IT'
                // },
                // {
                //     filter_id: 4,
                //     group_id: 11,
                //     value: 'Astana IT'
                // },
                // {
                //     filter_id: 4,
                //     group_id: 12,
                //     value: 'Astana IT'
                // },
                // {
                //     filter_id: 4,
                //     group_id: 13,
                //     value: 'Astana IT'
                // },
        ];

        for (let index = 0; index < data2.length; index++) {
            const item = data2[index];
            let copy = Object.assign({}, item);
            delete copy['data']
            const ibg = await this.dbConnection.table('info_by_group').insert(
                copy
            );
            const ibgId = ibg[0]
            Helper.sleep(400);
            
            const info = await this.dbConnection.table('info').insert({
                ibg_id: ibgId,
                info_content: JSON.stringify(
                    item.data
                )
            });
            item.infoId = info[0];

        }            
        // Insert to table

        const data3: { text?: number[] } = {};
        data2.forEach(item => {
            
            item.data?.authors.forEach(element => {
                if(!Array.isArray(data3[element]))
                    data3[element] = []
                data3[element].push( item.infoId )
            });
            item.data?.keywords.forEach(element => {
                if(!Array.isArray(data3[element]))
                    data3[element] = []
                data3[element].push( item.infoId )
            })
            item.data?.meta.forEach((meta) => {

                for (const [key, value] of Object.entries(meta)) {

                    if(!Array.isArray(data3[value]))
                        data3[value] = []

                    data3[value].push( item.infoId )
                }
        
            })

        });
        
        for (const [text, ids] of Object.entries(data3)) {

            const search_tag = await this.dbConnection.table('search_tag').insert({
                text,
                info_object: JSON.stringify({ ids })
            });

        }

    }
}
