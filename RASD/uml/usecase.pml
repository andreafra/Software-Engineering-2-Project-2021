@startuml
left to right direction
User as u
Manager as m
"Authenticated User" as au
' Totem as t
rectangle {
    u -- (Login)
    u -- (Sign\nUp)
    u -- (Join\nLine)
    u -- (Check\nStatus)

    au -- (Join\nLine)
    au -- (Check\nStatus)
    au -- (Book)
    au -- (View\nHistory)

    (Join\nLine) -- (Find\nStore) : <<includes>>
    (Book) -- (Find\nStore) : <<includes>>

    m -- (Modify\nStores)
    (Modify\nStores) -- (Add\nStore) : <<extends>>
    (Modify\nStores) -- (Edit\nStore) : <<extends>>
    m -- (Check\nStore)
}
@enduml