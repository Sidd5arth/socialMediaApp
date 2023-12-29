// checks user flow for logging in and visiting each page(component) then logging out
import "@cypress/code-coverage/support";
describe("check component", () => {
  beforeEach(() => {
    cy.login("abc@gmail.com", "abcgmail");
  });

  it("compoents renders correctly ", () => {
    const navigate = {
      home: 0,
      likes: 1,
      bookmark: 2,
      post: 3,
      profile: 4,
      logout: 5,
    };

    Object.entries(navigate).forEach(([key, value]) => {
      cy.navigateToVal(value);

      if (key === "home") {
        cy.contains("Explore Post").should("exist");
      } else if (key === "likes") {
        cy.contains("Liked Posts").should("exist");
      } else if (key === "bookmark") {
        cy.contains("Bookmarks").should("exist");
      } else if (key === "post") {
        cy.contains("Your Posts").should("exist");
      } else if (key === "logout") {
        cy.get(".bg-red-500").click();
        cy.contains("Logging out...").should("exist");
        cy.contains("Logging out...").should("not.exist");
        cy.url().should("eq", "http://localhost:3000/");
      } else {
        cy.navigateToVal(value);
      }
    });
  });
});
