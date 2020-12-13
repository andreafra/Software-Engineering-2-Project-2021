sig StoreSlot {
}

enum State { Ok, Cancelled }

sig Reservation {
	slot: StoreSlot,
	entrance: one Int,
	exit: one Int,
	state: one State
}{
	entrance >= 0
	exit > entrance
}

// a minimum time of 2 hours is kept between reservations to the same slot
fact baseRespectedTime {
	all disjoint r1, r2: Reservation | (r1.slot = r2.slot) =>
		(r1.entrance >= sum[r2.entrance+2] or r2.entrance >= sum[r1.entrance+2])
}

// there are not valid concurrent reservation for the same slot
fact noConcurrentReservation {
	all disjoint r1, r2: Reservation | (r1.state = Ok and r2.state = Ok and r1.slot = r2.slot) =>
		(r1.entrance >= r2.exit or r2.entrance >= r2.exit)
}

// if a reservation is cancelled it means that someone who came before was shopping slowly
fact noUselessCancellations {
	all r1: Reservation | r1.state = Cancelled => one r2: Reservation |
		(r2.state = Ok and r1.slot = r2.slot and 
		r2.entrance < r1.entrance and r1.entrance < r2.exit)
}
		
// if there are two concurrent reservations for the same slot one of them is cancelled
assert reservationCancelledIfConcurrent {
	all disjoint r1, r2: Reservation |
		(r1.slot = r2.slot and
			((r1.entrance >= r2.entrance and r1.exit < r2.exit) or
			(r2.entrance >= r1.entrance and r2.exit < r1.exit))
		) =>
			((r1.state = Cancelled) or r2.state = Cancelled)
		
}

pred base {
	#StoreSlot = 2
	#Reservation >= 4
	#Cancelled = 1
}

run base for 10

check reservationCancelledIfConcurrent
