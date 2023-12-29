import "@cypress/code-coverage/support";
describe("Create Post", () => {
  it("creates, adds, and deletes a post", () => {
    cy.login("abc@gmail.com", "abcgmail");

    cy.navigateToVal(0);

    cy.contains("Create a Post").should("exist");

    cy.get("textarea").type("This is a test post");

    cy.get("button").contains("Post").click();

    cy.get("button").should("not.contain", "Uploading");
    cy.contains("This is a test post").should("exist");

    cy.contains("This is a test post").should("not.contain", "Loading Posts");
    cy.get("button.text-red-400.hover\\:text-blue-400").first().click();
    cy.contains("button", "OK").click();
    cy.contains("This is a test post").should("not.exist");
  });
});
