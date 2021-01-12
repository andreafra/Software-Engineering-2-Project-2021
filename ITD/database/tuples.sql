set FOREIGN_KEY_CHECKS = 0;

delete from reservation;
delete from store;
delete from user;
delete from ticket;
delete from free_timeslot_notification;
delete from favorites;
delete from admin;
delete from managed_store;

insert into admin values (1, "admin", "password");
insert into store values (1, "Store 1", "Piazza Leonardo 32, Milano", 100);
insert into managed_store values (1, 1);

insert into reservation values (1, "mon", 16, 0, 10, TRUE, 1);
insert into reservation values (2, "mon", 16, 30, 10, TRUE, 1);
insert into reservation values (3, "mon", 17, 0, 10, TRUE, 1);
insert into reservation values (4, "mon", 17, 30, 10, TRUE, 1);
insert into reservation values (5, "mon", 18, 0, 10, TRUE, 1);
insert into reservation values (6, "mon", 18, 30, 10, TRUE, 1);
insert into reservation values (7, "mon", 19, 0, 10, TRUE, 1);
insert into reservation values (8, "mon", 19, 30, 10, TRUE, 1);

set FOREIGN_KEY_CHECKS = 1;