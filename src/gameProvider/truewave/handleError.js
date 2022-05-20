const xml2js = require("xml2js");
const handleError = (name, message, errorCode) => {
  const responseJSON = {
    message: {
      result: {
        $: {
          name: name,
          success: "0",
        },
        returnset: {
          error: {
            $: {
              value: message,
            },
          },
          errorCode: {
            $: {
              value: errorCode,
            },
          },
        },
      },
    },
  };

  const builder = new xml2js.Builder({ headless: true });
  const xml = builder.buildObject(responseJSON);

  return xml;
};

module.exports = handleError;
