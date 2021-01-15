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

set FOREIGN_KEY_CHECKS = 1;