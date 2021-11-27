import { Handler } from "@netlify/functions";
import sendgridMail from "@sendgrid/mail";

sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

export const handler: Handler = async (event) => {
  const audioBody = event.body;

  const msg = {
    to: process.env.EMAIL_TO,
    from: process.env.EMAIL_FROM,
    subject: "Audio Contact Message from Website",
    text: `Audio Message: `,
    html: `Audio Message: `,
    attachments: [
      {
        content: audioBody,
        filename: "audio.mp3",
        type: "audio/mpeg",
        disposition: "attachment"
      }
    ]
  };

  try {
    await sendgridMail.send(msg);
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);

      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*', // Required for CORS support to work
          'Access-Control-Allow-Headers': '*',
        },
        body: JSON.stringify({
          message: 'Error: '+JSON.stringify(error.response.body)
        }),
      };
    }
  }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      'Access-Control-Allow-Headers': '*',
    },
    body: JSON.stringify({
      message: 'Success!'
    }),
  };
};
