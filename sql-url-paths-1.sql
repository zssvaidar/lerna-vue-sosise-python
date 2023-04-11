select * from (
select url, SUBSTRING_INDEX(url, '/', 4) split, count(*) c

from dp3_database.page_url
group by split
) subq
where subq.c > 1
;
-- SELECT * FROM dp3_database.page_url;