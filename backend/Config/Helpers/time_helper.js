const time = () => {
  const now = new Date();
  now.setUTCHours(now.getUTCHours() + 3);
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };
  return now.toLocaleString("en-US", options);
};

module.exports = { time };
