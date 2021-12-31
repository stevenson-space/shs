// tests.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test
// test.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
})

describe('SHS Tests', function() {
    it('Home', function() {
        cy.visit('localhost:8080/?date=1-1-2022')
        cy.contains('Saturday, January 1')
        cy.get('.main > :nth-child(3)').click()
        cy.contains('Sunday, January 2')

        cy.visit('localhost:8080')
        cy.contains('Links')
        cy.contains('Schedule')
        cy.contains('Settings')
        cy.contains("Color")
        cy.get('.full-screen-mode').click()  //tests if the color toggle works
        cy.get('.header').should('have.css', 'background-color', 'rgb(27, 94, 32)')
        cy.get('.remove-color').click()
        cy.get('.header').should('have.css', 'background-color', 'rgb(255, 255, 255)')
    })
    it('/BellSchedules', function() {
        cy.visit('localhost:8080/?date=1-1-2022')
        cy.contains('Bell Schedules').click()
        cy.contains('Standard')
        cy.contains("1B").should('not.exist')
        cy.get(':nth-child(1) > .wrapper > .schedule-select > .dropdown > .select-option').click()
        cy.contains("Half Periods").click()
        cy.contains("1B")
        cy.get('.home').click()
        cy.contains("Links")
    })
    it('/Links', function() {
        cy.visit('localhost:8080/?date=1-1-2022')
        cy.contains('Links').click()
        cy.contains('D125')
        cy.contains('Testing Center')
    })
})