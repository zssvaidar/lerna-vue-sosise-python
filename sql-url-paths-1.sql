select * from (
select group_concat(url), SUBSTRING_INDEX(url, '/', 4) split, count(*) c

from dp3_database.page_url
) subq
where subq.c > 1
group by split
;
-- SELECT * FROM dp3_database.page_url;


select id, url, subq.ids, subq.split, subq.c 
from (
	select group_concat(';', id, ';') search_ids, group_concat(' ', id) ids, SUBSTRING_INDEX(url, '/', 5) split, count(*) c
	from page_url
	group by split
) subq 
join page_url
where subq.c > 1
and search_ids LIKE CONCAT('%;', id, ';%')
;