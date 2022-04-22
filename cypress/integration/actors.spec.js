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
      console.log(id);
    });
  });
});
