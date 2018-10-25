alter table documents drop constraint documents_post_id_fkey;
alter table images drop constraint images_post_id_fkey;
alter table posts drop constraint posts_pkey;
alter table posts drop column id;
alter table posts add column id text;
update posts set id = posts.post_id;
alter table posts alter column id set not null;
alter table posts add unique(id);
alter table posts alter column id add constraint default generate_uid(25);
alter table posts add primary key (id);
alter table documents add foreign key(post_id) references posts(id);
alter table images add foreign key(post_id) references posts(id);

