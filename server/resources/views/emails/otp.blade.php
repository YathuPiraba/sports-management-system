<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset OTP</title>
    <style type="text/css">
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
      }
      .header {
        background-color: #1c60b8;
        color: white;
        padding: 10px;
        text-align: center;
        width: 900px;
      }
      .header img {
        height: 90px;
      }
      .title {
        font-size: 24px;
      }
      .content {
        padding: 20px;
      }
      .otp-container {
        background-color: #f0f0f0;
        border: 1px solid #ddd;
        border-radius: 5px;
        padding: 10px;
        margin: 20px 0;
        text-align: center;
      }
      .otp {
        font-size: 24px;
        font-weight: bold;
        letter-spacing: 5px;
        color: #333;
      }
      .icon {
        text-align: center;
        margin-bottom: 20px;
      }
      .icon img {
        width: 60px;
        height: 60px;
      }
      #team {
        margin-top: 0px;
        font-weight: bold;
      }
      #thx {
        margin-bottom: 9px;
      }
      #warn {
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <!-- Header Section -->
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tbody width="100%">
        <tr>
          <td>
            <table width="900" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td class="header" align="center" style="padding: 20px 0">
                  <img
                    src="https://res.cloudinary.com/dmonsn0ga/image/upload/v1723798132/logo2_qanauk.png"
                    alt="Logo"
                    style="
                      display: inline-block;
                      margin: 0 auto 0px;
                      vertical-align: middle;
                    "
                  />
                  <span
                    class="title"
                    style="
                      color: #ffffff;
                      vertical-align: middle;
                      display: inline-block;
                    "
                    >Club Connect</span
                  >
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Main Content Section -->
    <table
      width="100%"
      border="0"
      cellspacing="0"
      cellpadding="0"
    >
      <tr>
        <td align="center">
          <table
            class="container"
            width="600"
            border="0"
            cellspacing="0"
            cellpadding="0"
          >
            <tr>
              <td class="content" style="padding: 20px">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td class="icon" align="center">
                      <img
                        src="https://res.cloudinary.com/dmonsn0ga/image/upload/v1723798232/locked_rqivr2.png"
                        alt="Lock Icon"
                        style="width: 60px; height: 60px"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h1 style="font-size: 24px">Hi {{ $name }},</h1>
                      <p>Your One-Time Password (OTP) for password reset is:</p>
                      <div class="otp-container">
                        <span class="otp">{{ $otp }}</span>
                      </div>
                      <p>
                        This OTP will expire in 10 minutes.
                        <span id="warn">Do not share this OTP</span> with
                        anyone.
                      </p>
                      <p id="thx">Thanks,</p>
                      <p id="team">The Club Connect Team</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
