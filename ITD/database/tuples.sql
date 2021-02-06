set FOREIGN_KEY_CHECKS = 0;

delete from reservation;
delete from store;
delete from user;
delete from ticket;
delete from free_timeslot_notification;
delete from favorites;
delete from admin;
delete from managed_store;
delete from token;
delete from verification_code;

insert into admin values (1, "admin", "password");
insert into store values (1, "Store 1", "Piazza Leonardo 32, Milano", 100, 0, 0, 0);
insert into managed_store values (1, 1);
insert into user values ('totem', 'Totemo', 'De Totemis', 1);
insert into token values ('totem', 'totem-token', '2025-01-01 00:00:00');

insert into reservation values (1, 1, "16:00", 10, TRUE, 1);
insert into reservation values (2, 1, "16:30", 10, TRUE, 1);
insert into reservation values (3, 1, "17:00", 10, TRUE, 1);
insert into reservation values (4, 1, "17:30", 10, TRUE, 1);
insert into reservation values (5, 1, "18:00", 10, TRUE, 1);
insert into reservation values (6, 1, "18:30", 10, TRUE, 1);
insert into reservation values (7, 1, "19:00", 10, TRUE, 1);
insert into reservation values (8, 1, "19:30", 10, TRUE, 1);

set FOREIGN_KEY_CHECKS = 1;