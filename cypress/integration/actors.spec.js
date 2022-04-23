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

  it("Checks if an actor can be edited", () => {
    // Click edit button on last actor in list
    cy.get(".table tr")
      .last()
      .within(() => {
        cy.get("td").eq(3).click();
      });
    cy.url().should("contains", "http://192.168.28.11/crud_php/actors/edit/");
    // Get unedited name and amount of times it's been auto edited
    cy.get("#name").then(($name) => {
      const nameStr = $name.val().split(" ");
      let counter = 1;
      if (nameStr[nameStr.length - 2] === "Edited") {
        counter = nameStr[nameStr.length - 1].slice(1);
        counter = parseInt(counter) + 1;
      }
      cy.wrap(
        $name.val().replace(/ - Edited(.*)/, "") + " - Edited x" + counter
      ).as("name");
    });
    // Edit actor's info
    cy.get("@name").then(($name) => {
      cy.get("#name").clear().type($name);
    });
    cy.get("#dateOfBirth").type("2001-05-12");
    cy.get(".form-check").then(($array) => {
      // Randomly assign / unassign 5 movies from actor
      const numbers = [];
      for (let i = 0; i < 5; i++) {
        let num = 0;
        while (true) {
          num = Math.floor(Math.random() * $array.length);

          if (!numbers.includes(num)) {
            numbers.push(num);
            break;
          }
        }

        // Check / Uncheck a movie
        cy.get(".form-check")
          .eq(num - 1)
          .within(() => {
            cy.get("input").click();
          });
      }
    });

    // Add all checked movies to an array for comparison later
    const movies = [];
    cy.wrap(movies).as("movies");
    cy.get(".form-check > input:checked").each((checkedElement) => {
      cy.get(checkedElement)
        .parent()
        .within(() => {
          cy.get("label").then((label) => {
            movies.push(label.text().trim());
          });
        });
    });
    // Submit
    cy.get(".btn").click();
    cy.url().should("eq", "http://192.168.28.11/crud_php/actors");
    // Check if new name is registered
    cy.get(".table tr").last().click();
    cy.get("table")
      .eq(0)
      .within(() => {
        // Check if the name is edited
        cy.get("@name").then(($name) => {
          cy.get("td")
            .eq(1)
            .then((element) => {
              expect(element.text().trim()).to.be.equal($name);
            });
        });
      });
    // Check if movies are edited
    cy.get("@movies").then(($movies) => {
      cy.get("table")
        .eq(1)
        .within(() => {
          cy.get("td:nth-child(2)").then(($elements) => {
            for (let i = 0; i < $elements.length; i++) {
              cy.get("td:nth-child(2)")
                .eq(i)
                .then((element) => {
                  expect($movies.includes(element.text())).to.be.true;
                });
            }
          });
        });
    });
  });
});
