describe("Actor CRUD opertation tests", () => {
  beforeEach(() => {
    cy.visit("http://192.168.28.11/crud_php/");
  });

  it("checks if an actor can be created", () => {
    cy.get("button").contains("Create").click();
    cy.url().should("contains", "http://192.168.28.11/crud_php/actors/new");
    cy.get("#name").click();
    cy.get("#name").type("Dante Ravioli");
    cy.get("#dateOfBirth").click();
    cy.get("#dateOfBirth").click();
    cy.get("#dateOfBirth").type("2002-01-22");
    cy.get("html").click();
    cy.get(".btn").click();
    cy.url().then((url) => {
      const id = url.split("/").pop();
      cy.get(".navbar-brand").click();
      cy.url().should("contains", "http://192.168.28.11/crud_php/");
      cy.get(".table tr")
        .last()
        .within(() => {
          cy.get("td").first().contains(id);
        });
    });
  });

  it("Checks for a list of actors", () => {
    cy.get(".nav-link[href=actors]").click();
    cy.url().should("contains", "http://192.168.28.11/crud_php/actors");
    cy.get(".table").find("td").its("length").should("be.gte", 5);
  });

  it("Checks if an actor can be deleted", () => {
    // Get original Actor's table length
    cy.get(".table")
      .find("tr")
      .then((elements) => {
        cy.wrap(elements.length).as("oldLength");
      });
    // Delete row from Actor's table
    cy.get(".table tr")
      .last()
      .within(() => {
        cy.get("td").last().click();
      });
    // Get new Actor's table length
    cy.get(".table")
      .find("tr")
      .then((elements) => {
        cy.wrap(elements.length).as("newLength");
      });
    // Compare old Actor's table length to the new one
    cy.get("@oldLength").then((oldLength) => {
      cy.get("@newLength").then((newLength) => {
        expect(newLength).to.be.lessThan(oldLength);
      });
    });
  });
});
