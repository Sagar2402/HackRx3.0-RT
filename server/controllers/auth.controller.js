const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const {
  authService,
  userService,
  tokenService,
  referralService,
} = require("../services");
const { emailTemplate } = require("../utils/emailTemplate");
const { sendEmail } = require("../services/ses.service");

const register = catchAsync(async (req, res) => {
  const requestBody = req.body;
  if (requestBody.referralCode) {
    const referralDetail = await referralService.verifyReferralCode(
      req.body.referralCode
    );
    Object.assign(requestBody, { referredBy: referralDetail.owner });
  }
  const user = await userService.createUser(requestBody);
  const referralCode = await referralService.createReferralCode(user.id);
  if (requestBody.referralCode && user) {
    await referralService.updateReferralCodeUsage(
      requestBody.referralCode,
      user
    );
  }
  const tokens = await tokenService.generateAuthTokens(user);

  // verification mail
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
  const verificationEmailUrl = `${process.env.APP_URL}/verify-email?token=${verifyEmailToken}`;
  const text = `Dear user,
  To verify your email, click on this link: ${verificationEmailUrl}
  If you did not create an account, then ignore this email.`;
  const html = emailTemplate(
    user.name,
    "Please click the below button to verify your account.",
    verificationEmailUrl,
    "Verify"
  );
  sendEmail(user.email, "Email Verification - Inclaim", html, text);

  res.status(httpStatus.CREATED).send({
    code: 201,
    message: "Successfully Registered",
    user,
    tokens,
    referralCode,
  });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ code: 200, message: "Login Successfull", user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(
    req.body.email
  );
  const resetPasswordUrl = `${process.env.APP_URL}/rest-password?token=${resetPasswordToken}`;
  const text = `Dear user,
  To reset your password, click on this link: ${resetPasswordUrl}
  If you did not request any password resets, then ignore this email.`;
  const html = emailTemplate(
    null,
    "Please click the below button to reset your password.",
    resetPasswordUrl,
    "Reset Password"
  );
  sendEmail(req.body.email, "Password Reset - Inclaim", html, text);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(
    req.user
  );
  const verificationEmailUrl = `${process.env.APP_URL}/verify-email?token=${verifyEmailToken}`;
  const text = `Dear user,
  To verify your email, click on this link: ${verificationEmailUrl}
  If you did not create an account, then ignore this email.`;
  const html = emailTemplate(
    req.user.name,
    "Please click the below button to verify your account.",
    verificationEmailUrl,
    "Verify"
  );
  sendEmail(req.user.email, "Email Verification - Inclaim", html, text);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};
