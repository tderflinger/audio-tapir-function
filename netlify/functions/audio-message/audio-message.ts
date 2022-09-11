import { Handler } from "@netlify/functions";
import sendgridMail from "@sendgrid/mail";

sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Successful preflight call." }),
    };
  } else if (event.httpMethod === "POST") {

    const audioBody = event.body;

    if (!audioBody) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          message: 'Error: No body with audio data!'
        }),
      };
    }
    
    // encode as BASE64
    const audioBodyBase64 = btoa(audioBody);

    const msg = {
      to: process.env.EMAIL_TO,
      from: process.env.EMAIL_FROM,
      subject: "Audio Contact Message from Website",
      text: `Audio Message: `,
      html: `Audio Message: `,
      attachments: [
        {
          content: audioBodyBase64,
          filename: "audio-message.wav",
          type: "audio/wav",
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
          headers,
          body: JSON.stringify({
            message: 'Error: '+JSON.stringify(error.response.body)
          }),
        };
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Success!'
      }),
    };
  }
};
