const agora = require("agora-token");

const appId = "104e87620771434cbfba90ac0ab35b3c";
const appCertificate = "487dfed547d14c94a0b6edefa842a724";

function generateToken(channelName, userId) {
  const agoraConfig = {
    appId: appId,
    appCertificate: appCertificate,
  };
  const token = agora.RtcTokenBuilder.buildTokenWithUid(
    agoraConfig.appId,
    agoraConfig.appCertificate,
    channelName,
    0,
    agora.RtcRole.PUBLISHER,
    3600
  );
  console.log("token is " + token);
  return token;
}
module.exports = { generateToken };
