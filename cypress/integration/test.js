Cypress.on("uncaught:exception", (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false;
});

const url = "localhost:8080";
describe("SHS Tests", function() {
  specify("Move Between Days", function() {
    cy.visit(`${url}/?date=1-1-2022`);
    cy.contains("Saturday, January 1");
    cy.get(".main > :nth-child(3)").click();
    cy.contains("Sunday, January 2");
  });

  specify("Countdown", function() {
    const date = new Date("8-12-2021 13:40:55");
    cy.clock(date);
    cy.visit(url);
    cy.get(".countdown").contains("0:05");
    cy.tick(5000);
    cy.get(".center > .period").contains("Passing");
    cy.tick(61000);
    cy.get(".countdown").contains("3:59");
  });

  specify("Home Page Content", function() {
    cy.visit(url);
    cy.contains("Links");
    cy.contains("Schedule");
    cy.contains("Settings");
    cy.contains("Color");
  });

  specify("Full Screen Mode", function() {
    cy.visit(url);
    cy.get(".full-screen-mode").click(); // enter full screen
    cy.get(".header").should("have.css", "background-color", "rgb(27, 94, 32)");
    cy.get(".remove-color").click(); // remote the background color
    cy.get(".header").should("have.css", "background-color", "rgb(255, 255, 255)");
    cy.get(".full-screen-mode").click(); // enter out of full screen
    cy.get(".header").should("have.css", "background-color", "rgb(27, 94, 32)");
  });

  specify("NewThemeCard", function() {
    cy.visit(`${url}/?date=10-17-2021`);
    cy.contains("Halloween");
    cy.visit(`${url}/?date=10-22-2021`);
    cy.contains("Halloween").should("not.exist"); // the halloween card should not show after 7 days
  });

  specify("BellSchedules", function() {
    //test switching bell schedules
    cy.visit(`${url}/?date=1-1-2022`);
    cy.contains("Bell Schedules").click();
    cy.contains("Standard");
    cy.contains("1B").should("not.exist");
    cy.get(":nth-child(1) > .wrapper > .schedule-select > .dropdown > .select-option").click();
    cy.contains("Half Periods").click();
    cy.contains("1B");
  });

  specify("HomeLink", function() {
    cy.visit(`${url}/colors`);
    cy.get(".home").click();
    cy.contains("Links");
  });

  specify("Links", function() {
    cy.visit(`${url}/?date=1-1-2022`);
    cy.contains("Links").click();
    cy.contains("D125");
    cy.contains("Testing Center");
  });

  specify("Timer", function() {
    const now = new Date();
    cy.visit(url);
    cy.contains("Tools").click(); //click on tools page
    cy.contains("Timer");
    cy.get(".add-time-buttons > :nth-child(1)").click(); //add time to the timer
    cy.get(".add-time-buttons > :nth-child(2)").click();
    cy.get(".add-time-buttons > :nth-child(3)").click();
    cy.get(":nth-child(4) > .selected").contains("21"); //check the numbers on the timer
    cy.get(":nth-child(7) > .selected").contains("00");
    cy.clock(now);
    cy.contains("Start").click(); // start timer
    cy.tick(90000); // wait 1 minute and 30 seconds
    cy.get(":nth-child(4) > .selected").contains("19"); // minute hand
    cy.get(":nth-child(7) > .selected").contains("30"); // second hand
    cy.contains("Reset").click(); //reset the timer
    cy.get(":nth-child(4) > .selected").contains("21");
  });

  specify("Changing Themes", function() {
    cy.visit(`${url}/colors`);
    cy.get("body").should("have.css", "background-color", "rgb(255, 255, 255)");
    cy.contains("Dark").click(); //change to dark theme
    cy.get("body").should("have.css", "background-color", "rgb(35, 39, 42)");
    cy.get(".custom-color").contains("#b38825");
  });

  specify("Setting Custom Color", function() {
    cy.visit(`${url}/colors`);
    cy.get(".color")
      .first()
      .click();
    cy.get(".shade")
      .first()
      .click();
    cy.get(".custom-color").contains("#ffcdd2");
    cy.get(".custom-color").should("have.css", "color", "rgb(255, 205, 210)");
    cy.visit(`${url}/colors`);
    cy.contains("Light").click(); //change back to light theme
    cy.contains("Color Conflict");
    cy.contains("No").click();
    cy.get(".custom-color").contains("#ffcdd2");
    cy.contains("Dark").click();
    cy.contains("Color Conflict");
    cy.contains("Yes").click();
    cy.get(".custom-color").contains("#b38825");
  });
});
