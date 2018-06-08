class Users {
  constructor() {
    this.users = [];
  }

  addUser(id, name, room) {
    // add a user object to users array
    let user = { id, name, room };
    this.users.push(user);
    return user;
  }

  removeUser(id) {
    // retrieve user object from users array by user id
    let userById = this.getUser(id);
    // remove user object with that id from users array
    if (userById) {
      this.users = this.users.filter(val => val.id !== id);
    }
    // return user object that was removed from users array
    // if !useById, returns undefined
    return userById;
  }

  getUser(id) {
    // return user object from users array by user id
    return this.users.filter(val => val.id === id)[0];
  }

  getUserList(room) {
    // this.users is the users array, which we filter for true/false user in that room
    let users = this.users.filter(user => user.room === room);
    // ...and then we create a new array containing the user names in that room
    let namesArray = users.map(user => user.name);
    return namesArray;
  }
}

module.exports = { Users };
