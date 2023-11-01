const agora = require("agora-token");

const appId = "717af643b1f44b85aa1a98fee5cdd6a1";
const appCertificate = "401739e3af104160baf5ee08a6f4e567";

function generateToken(channelName, userId) {
  const agoraConfig = {
    appId: appId,
    appCertificate: appCertificate,
  };
  const token = agora.RtcTokenBuilder.buildTokenWithUid(
    agoraConfig.appId,
    agoraConfig.appCertificate,
    channelName,
    userId,
    agora.RtcRole.PUBLISHER,
    3600
  );
  console.log("token is " + token);
  return token;
}
module.exports = { generateToken };
