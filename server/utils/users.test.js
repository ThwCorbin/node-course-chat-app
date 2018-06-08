const expect = require("expect");

const { Users } = require("./users");

describe("Users", () => {
  // Seed data
  let users;
  beforeEach(() => {
    users = new Users();
    users.users = [
      {
        id: "1",
        name: "Deb",
        room: "Node Course"
      },
      {
        id: "2",
        name: "Jen",
        room: "React Course"
      },
      {
        id: "3",
        name: "Julie",
        room: "Node Course"
      }
    ];
  });

  it("should add new user", () => {
    let users = new Users();
    let user = {
      id: "123",
      name: "Tom",
      room: "Room of Requirement"
    };
    users.addUser(user.id, user.name, user.room);

    expect(users.users).toEqual([user]);
    // users.users 1st variable refers to this block let users = new Users();
    // 2nd variable refers to this.users array created by constructor
  });

  it("should remove a user", () => {
    let userId = "1";
    let user = users.removeUser(userId);

    expect(user.id).toBe(userId);
    expect(users.users.length).toBe(2);
  });

  it("should not remove a user", () => {
    let userId = "5";
    let user = users.removeUser(userId);

    expect(user).toBeFalsy();
    expect(users.users.length).toBe(3);
  });

  it("should find a user", () => {
    let userId = "1";
    let user = users.getUser(userId);

    expect(user.id).toBe(userId);
  });

  it("should not find a user", () => {
    let user = users.getUser("4");

    expect(user).toBe(undefined);
  });

  it("should return names for node course", () => {
    let userList = users.getUserList("Node Course");

    expect(userList).toEqual(["Deb", "Julie"]);
  });

  it("should return names for react course", () => {
    let userList = users.getUserList("React Course");

    expect(userList).toEqual(["Jen"]);
  });
});
