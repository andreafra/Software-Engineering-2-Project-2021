const queryManager = require(".");

test('check if user is created', () => {
    queryManager.executeAndRollback(() => {
        queryManager.createUser("0000", "Luigi", "Fusco");
        expect(queryManager.checkIfPhoneNumberIsPresent("0000")).toBe(true)
        expect(queryManager.checkIfPhoneNumberIsPresent("1111")).toBe(false)
    })
})


//queryManager.close();