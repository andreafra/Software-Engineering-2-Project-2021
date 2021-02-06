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
insert into store values (1, "Store Aurora", "Via Spinoza, 4, Milano", 100, 0, 45.47962, 9.22525);
insert into store values (2, "Store Vincenza", "Piazza Leonardo, 26, Milano", 60, 0, 45.47690, 9.22612);
insert into store values (3, "Store Olga", "Viale Romagna, 61, Milano ", 40, 0, 45.47862, 9.22335);

insert into managed_store values (1, 1);
insert into managed_store values (2, 1);
insert into managed_store values (3, 1);

insert into user values ('totem', 'Totemo', 'De Totemis', 1);
insert into token values ('totem', 'totem-token', '2025-01-01 00:00:00');

insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 1, "08:00", 10, TRUE, 1);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 1, "10:00", 10, TRUE, 1);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 1, "13:00", 10, TRUE, 1);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 1, "16:00", 10, TRUE, 1);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 1, "17:00", 10, TRUE, 1);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 1, "18:00", 10, TRUE, 1);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 2, "08:00", 10, TRUE, 1);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 2, "10:00", 10, TRUE, 1);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 2, "16:00", 10, TRUE, 1);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 2, "17:00", 10, TRUE, 1);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 2, "18:00", 10, TRUE, 1);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 3, "08:00", 10, TRUE, 1);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 3, "10:00", 10, TRUE, 1);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 3, "16:00", 10, TRUE, 1);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 3, "18:00", 10, TRUE, 1);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 4, "08:00", 10, TRUE, 1);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 4, "10:00", 10, TRUE, 1);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 4, "16:00", 10, TRUE, 1);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 4, "17:00", 10, TRUE, 1);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 4, "18:00", 10, TRUE, 1);

insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 1, "08:00", 10, TRUE, 2);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 1, "10:00", 10, TRUE, 2);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 1, "13:00", 10, TRUE, 2);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 1, "16:00", 10, TRUE, 2);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 1, "17:00", 10, TRUE, 2);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 1, "18:00", 10, TRUE, 2);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 2, "08:00", 10, TRUE, 2);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 2, "10:00", 10, TRUE, 2);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 2, "16:00", 10, TRUE, 2);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 2, "17:00", 10, TRUE, 2);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 2, "18:00", 10, TRUE, 2);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 3, "08:00", 10, TRUE, 2);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 3, "10:00", 10, TRUE, 2);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 3, "16:00", 10, TRUE, 2);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 3, "18:00", 10, TRUE, 2);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 4, "08:00", 10, TRUE, 2);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 4, "10:00", 10, TRUE, 2);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 4, "16:00", 10, TRUE, 2);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 4, "17:00", 10, TRUE, 2);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 4, "18:00", 10, TRUE, 2);

insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 1, "08:00", 10, TRUE, 3);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 1, "10:00", 10, TRUE, 3);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 1, "13:00", 10, TRUE, 3);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 1, "16:00", 10, TRUE, 3);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 1, "17:00", 10, TRUE, 3);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 1, "18:00", 10, TRUE, 3);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 2, "08:00", 10, TRUE, 3);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 2, "10:00", 10, TRUE, 3);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 2, "16:00", 10, TRUE, 3);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 2, "17:00", 10, TRUE, 3);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 2, "18:00", 10, TRUE, 3);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 3, "08:00", 10, TRUE, 3);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 3, "10:00", 10, TRUE, 3);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 3, "16:00", 10, TRUE, 3);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 3, "18:00", 10, TRUE, 3);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 4, "08:00", 10, TRUE, 3);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 4, "10:00", 10, TRUE, 3);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 4, "16:00", 10, TRUE, 3);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 4, "17:00", 10, TRUE, 3);
insert into reservation(weekday,start_time, max_people_allowed, is_active, store_id)values ( 4, "18:00", 10, TRUE, 3);


set FOREIGN_KEY_CHECKS = 1;