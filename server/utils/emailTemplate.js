/* eslint-disable max-len */
const emailTemplate = (title, description, url, Button) => {
  const sal = title ? `Hi, ${title}` : `Dear User,`;
  return `<html>

  <head>
      <style>
          h3,
          p {
              color: #fff;
          }
      </style>
  
  </head>
  
  <body>
      <div style="background-color:#ececec;padding:10px;margin:0 auto;font-weight:200;width:100%!important">
          <table align="center" border="0" cellspacing="0" cellpadding="0"
              style="table-layout:fixed;font-weight:200;font-family:Helvetica,Arial,sans-serif" width="100%">
              <tbody>
                  <tr>
                      <td align="center">
                          <center style="width:100%">
                              <table bgcolor="#1a0c30" border="0" cellspacing="0" cellpadding="0"
                                  style="margin:0 auto;max-width:512px;font-weight:200;width:inherit;font-family:Helvetica,Arial,sans-serif"
                                  width="512">
                                  <tbody>
                                      <tr>
                                          <td bgcolor="#F3F3F3" width="100%"
                                              style="background-color:#1a0c30;padding:12px;border-bottom:0px solid #46B5D1">
                                              <table border="0" cellspacing="0" cellpadding="0"
                                                  style="font-weight:200;width:100%!important;font-family:Helvetica,Arial,sans-serif;min-width:100%!important"
                                                  width="100%">
                                                  <tbody>
                                                      <tr>
                                                          <td align="left" valign="middle" width="50%"><span
                                                                  style="font-weight: bold;margin:0;color:#fff;white-space:normal;display:inline-block;text-decoration:none;font-size:12px;line-height:20px">Inclaim</span>
                                                          </td>
                                                          <td valign="middle" width="50%" align="right"
                                                              style="padding:0 0 0 10px"><span
                                                                  style="margin:0;color:#fff;white-space:normal;display:inline-block;text-decoration:none;font-size:12px;line-height:20px"
                                                                  id="date">${Date()
                                                                    .toString()
                                                                    .substring(
                                                                      0,
                                                                      24
                                                                    )}</span>
                                                          </td>
                                                          <td width="1">&nbsp;</td>
                                                      </tr>
                                                  </tbody>
                                              </table>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td align="left">
                                              <table border="0" cellspacing="0" cellpadding="0"
                                                  style="font-weight:200;font-family:Helvetica,Arial,sans-serif"
                                                  width="100%">
                                                  <tbody>
  
  
                                                      <tr>
                                                          <td bgcolor="#F3F3F3" width="100%"
                                                              style="background-color:#f3f3f3;padding:1px;border-bottom:1px solid #ececec">
  
                                                          </td>
                                                      </tr>
                                                      <tr>
                                                          <td align="left">
                                                              <table border="0" cellspacing="0" cellpadding="0"
                                                                  style="font-weight:200;font-family:Helvetica,Arial,sans-serif"
                                                                  width="100%">
                                                                  <tbody>
                                                                      <tr>
                                                                          <td width="100%">
                                                                              <table border="0" cellspacing="0"
                                                                                  cellpadding="0"
                                                                                  style="font-weight:200;font-family:Helvetica,Arial,sans-serif"
                                                                                  width="100%">
                                                                                  <tbody>
  
                                                                                      <tr>
                                                                                          <td align="center"
                                                                                              style="padding:20px 0 10px 0">
                                                                                              <table border="0"
                                                                                                  cellspacing="0"
                                                                                                  cellpadding="0"
                                                                                                  style="font-weight:200;font-family:Helvetica,Arial,sans-serif"
                                                                                                  width="100%">
                                                                                                  <tbody>
                                                                                                      <tr>
                                                                                                          <td align="center"
                                                                                                              width="100%"
                                                                                                              style="padding: 0 15px;text-align: justify;color: rgb(76, 76, 76);font-size: 12px;line-height: 18px;">
                                                                                                              <h3 style="font-weight: 600; padding: 0px; margin: 0px; font-size: 16px; line-height: 24px; text-align: center;"
                                                                                                                  className="title-color">
                                                                                                                ${sal}
                                                                                                              </h3>
                                                                                                              <p
                                                                                                                  style="margin: 20px 0 30px 0;font-size: 15px;text-align: center;">
  
                                                                                                                  <b>${description}</b>
                                                                                                              </p>
                                                                                                              <div
                                                                                                                  style="font-weight: 200; text-align: center; margin: auto; ">
                                                                                                                  <a style="padding:0.6em 1em;border-radius:10px;color:#1a1a1a;font-size:14px;text-decoration:none;font-weight:bold; background-color: #fff; padding:10px 20px;text-align: center;"
                                                                                                                      href=${url}
                                                                                                                      className="button-color">${Button}</a>
                                                                                                              </div>
                                                                                                              <br />
                                                                                                              <div
                                                                                                                  style="font-weight: 200; text-align: center; margin: 25px;">
                                                                                                                  <a style="padding:0.6em 1em;border-radius:600px;color:#ffffff;font-size:14px;text-decoration:none;font-weight:bold"
                                                                                                                      href="https://www.instagram.com/Inclaim/"
                                                                                                                      className="button"><img
                                                                                                                          style="width:30px; height:30px;"
                                                                                                                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/768px-Instagram_logo_2016.svg.png"></a><a
                                                                                                                      style="padding:0.6em 1em;border-radius:600px;color:#ffffff;font-size:14px;text-decoration:none;font-weight:bold"
                                                                                                                      href="https://twitter.com/Inclaim"
                                                                                                                      className="button"><img
                                                                                                                          style="width:30px; height:30px;"
                                                                                                                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Twitter-logo.svg/2491px-Twitter-logo.svg.png"></a>
                                                                                                                  <a style="padding:0.6em 1em;border-radius:600px;color:#ffffff;font-size:14px;text-decoration:none;font-weight:bold"
                                                                                                                      href="https://www.linkedin.com/company/Inclaim/"
                                                                                                                      className="button"><img
                                                                                                                          style="width:30px; height:30px;"
                                                                                                                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/800px-LinkedIn_logo_initials.png"></a>
                                                                                                              </div>
  
  
                                                                                                          </td>
                                                                                                      </tr>
                                                                                                  </tbody>
                                                                                              </table>
                                                                                          </td>
                                                                                      </tr>
                                                                                      <tr>
                                                                                      </tr>
                                                                                      <tr>
                                                                                      </tr>
                                                                                  </tbody>
                                                                              </table>
                                                                          </td>
                                                                      </tr>
                                                                  </tbody>
                                                              </table>
                                                          </td>
                                                      </tr>
                                                    
                                                                      <tr>
                                                                          <td align="center" width="100%">
                                                                              <table border="0" cellspacing="0"
                                                                                  cellpadding="0"
                                                                                  style="font-weight:200;font-family:Helvetica,Arial,sans-serif"
                                                                                  width="100%">
                                                                                  <tbody>
                                                                                      <tr>
                                                                                          <td align="center"
                                                                                              style="padding:0 0 8px 0"
                                                                                              width="100%"></td>
                                                                                      </tr>
                                                                                  </tbody>
                                                                              </table>
                                                                          </td>
                                                                      </tr>
                                                                  </tbody>
                                                              </table>
                                                          </td>
                                                      </tr>
                                                  </tbody>
                                              </table>
                          </center>
                      </td>
                  </tr>
              </tbody>
          </table>
      </div>
  
  </body>
  
  </html>`;
};

module.exports = {
  emailTemplate,
};
