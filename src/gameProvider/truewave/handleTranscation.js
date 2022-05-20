const xml2js = require("xml2js");
const handleTranscation = (
  type,
  token,
  amount,
  transactionId,
  alreadyProcessed
) => {
  const responseJSON = {
    message: {
      result: {
        $: {
          name: type,
          success: "1",
        },
        returnset: {
          token: {
            $: {
              value: token,
            },
          },
          balance: {
            $: {
              value: amount,
            },
          },
          transactionId: {
            $: {
              value: transactionId,
            },
          },
          alreadyProcessed: {
            $: {
              value: alreadyProcessed,
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

module.exports = handleTranscation;
