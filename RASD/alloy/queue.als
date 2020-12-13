sig StoreSlot {
}

sig Ticket {
  entrance: one Int,
  exit : one Int,
  slot: one StoreSlot
}{
  exit>= sum[entrance+1] //ticket dura un ora
}


fact no_StoreSlot_without_ticket{
  no s: StoreSlot | no t: Ticket | s = t.slot
}

fact one_person_at_max_for_each_StoreSlot {
  all disjoint t1, t2: Ticket | (t1.slot = t2.slot) =>
     (t1.exit<t2.entrance or t2.exit <t1.entrance )
}

assert no_StoreSlot_with_two_people{
 no disjoint t1,t2 : Ticket | (t1.slot = t2.slot) and
  ( (t1.entrance<t2.entrance and t1.exit>=t2.entrance) or (t2.entrance<t1.entrance and t2.exit>=t1.entrance))
}

pred base {
  #Ticket >= 4
  #StoreSlot >= 2
}

run base for  40

check no_StoreSlot_with_two_people
