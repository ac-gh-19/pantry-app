const { isValidPassword } = require("./validPassword");

describe("isValidPassword", () => {
  test("valid password passes", () => {
    expect(isValidPassword("abc12345")).toBe(true);
  });

  test("too short fails", () => {
    expect(isValidPassword("a1b2")).toBe(false);
  });

  test("no number fails", () => {
    expect(isValidPassword("abcdefgh")).toBe(false);
  });

  test("no letter fails", () => {
    expect(isValidPassword("12345678")).toBe(false);
  });
});
