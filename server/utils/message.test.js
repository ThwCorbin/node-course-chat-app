const expect = require("expect");

const { generateMessage, generateLocationMessage } = require("./message.js");

describe("generateMessage", () => {
  it("should generate correct message object", () => {
    let from = "Steve";
    let text = "Hello, robot!";
    let res = generateMessage(from, text);

    expect(typeof res.createdAt).toBe("number");
    expect(res).toMatchObject({ from, text });
  });
});

describe("generateLocationMessage", () => {
  it("should generate correct location object", () => {
    let from = "Bill";
    let lat = 15;
    let lng = 20;
    let url = `https://www.google.com/maps?q=15,20`;
    let res = generateLocationMessage(from, lat, lng);

    expect(typeof res.createdAt).toBe("number");
    expect(res).toMatchObject({ from, url });
  });
});
