# Components

The following components will be implemented:

- AccountManager
- StoreSearch (stub)
- StoreHandler
- QueryManager
- NotificationManager (stub)
- AdminServices

Each top level component needs it's own subfolder, such as

```
+ components
|--+ StoreHandler
|  |-- index.js (or StoreHandler.js)
|  |-- QueueManager.js
|  |-- TicketManager.js
|  |-- ReservationManager.js
|  ...
|--+ AccountManager
...
```
