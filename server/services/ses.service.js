const AWS = require("aws-sdk");

const sendEmail = async (email, mailSubject, html, text) => {
  try {
    const params = html
      ? {
          Body: {
            Html: {
              // HTML Format of the email
              Charset: "UTF-8",
              Data: html,
            },
            Text: {
              Charset: "UTF-8",
              Data: text,
            },
          },
        }
      : {
          Body: {
            Text: {
              Charset: "UTF-8",
              Data: text,
            },
          },
        };
    const ses = new AWS.SES({
      accessKeyId: process.env.AWS_ACCESS_KEY_1,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_1,
      region: process.env.REGION_1,
    });
    const sesParams = {
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        ...params,
        Subject: {
          Charset: "UTF-8",
          Data: mailSubject,
        },
      },
      Source: '"Inclaim" <no-reply@inclaim.tech>',
      ReplyToAddresses: ["contactus@inclaim.tech"],
    };
    const notify = await ses.sendEmail(sesParams).promise();
    return {
      success: true,
      message: notify,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};
module.exports = {
  sendEmail,
};
