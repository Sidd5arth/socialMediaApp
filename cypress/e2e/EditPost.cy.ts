import "@cypress/code-coverage/support";
describe("Edit Post", () => {
  it("Edits a post", () => {
    cy.login("abc@gmail.com", "abcgmail");

    cy.navigateToVal(0);

    cy.contains("Explore Post").should("exist");

    cy.get("button").contains("edit").click();
    cy.contains("Edit here").should("exist");
    cy.get("input[type=text]").type("hello");

    cy.contains("button", "OK").click();
    // cy.contains("Edit here").should("not.exist");
  });
  it("like a post", () => {
    cy.login("abc@gmail.com", "abcgmail");

    cy.navigateToVal(0);

    cy.get(`[aria-label="unlike-button"]`).first().click();

    cy.contains("Explore Post").should("exist");

    cy.get(`[aria-label="like-count"]`).contains("1").should("exist");

    cy.get(`[aria-label="like-button"]`).first().click();
    cy.get(`[aria-label="like-count"]`).contains("0").should("exist");
    // cy.contains("Edit here").should("not.exist");
  });
  it("like a post", () => {
    cy.login("abc@gmail.com", "abcgmail");

    cy.navigateToVal(0);

    cy.get(`[aria-label="un-bookmark"]`).first().click();

    cy.contains("Explore Post").should("exist");

    cy.get(`[aria-label="bookmark-count"]`).contains("1").should("exist");

    cy.get(`[aria-label="bookmark"]`).first().click();
    cy.get(`[aria-label="bookmark-count"]`).contains("0").should("exist");
    // cy.contains("Edit here").should("not.exist");
  });
});
