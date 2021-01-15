const queryManager = require(".");

test('check if user is created', async () => {
    const queryInterface = await queryManager.getQueryInterface()
    await queryInterface.executeAndRollback(async () => {
        await queryInterface.createUser("0000", "Luigi", "Fusco")
    
        var isPresent
    
        isPresent = await queryInterface.checkIfPhoneNumberIsPresent("0000")
        expect(isPresent).toBe(true)
    
        isPresent = await queryInterface.checkIfPhoneNumberIsPresent("1111")
        expect(isPresent).toBe(false)
    })

    await queryInterface.globalEnd();
})


//queryManager.close();