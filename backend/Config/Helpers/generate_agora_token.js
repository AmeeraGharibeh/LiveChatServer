const agora = require("agora-token");

const appId = "104e87620771434cbfba90ac0ab35b3c";
const appCertificate = "401739e3af104160baf5ee08a6f4e567";

function generateToken(channelName, userId) {
  const agoraConfig = {
    appId: appId,
    appCertificate: appCertificate,
  };
  const token = agora.RtcTokenBuilder.buildTokenWithUserAccount(
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
