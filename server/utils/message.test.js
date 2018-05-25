const expect = require("expect");

const { generateMessage } = require("./message");

describe("generateMessage", () => {
  it("should generate correct message object", () => {
    let from = "Tom";
    let text = "Hello, robot!";
    let res = generateMessage(from, text);

    expect(typeof res.createdAt).toBe("number");
    expect(res).toMatchObject({ from, text });
  });
});
