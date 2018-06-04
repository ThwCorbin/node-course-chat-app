const moment = require("moment");

const generateMessage = (from, text) => {
  return {
    from,
    text,
    createdAt: moment().valueOf()
    // createdAt: new Date().getTime()
  };
};

const generateLocationMessage = (from, lat, lng) => {
  return {
    from,
    url: `https://www.google.com/maps?q=${lat},${lng}`,
    createdAt: moment().valueOf()
    // createdAt: new Date().getTime()
  };
};

module.exports = { generateMessage, generateLocationMessage };
