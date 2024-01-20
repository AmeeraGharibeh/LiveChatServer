const time = (now) => {
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

const calculateDateAfterDays = (days) => {
  const currentDate = new Date();

  const newDate = new Date(currentDate.getTime() + days * 24 * 60 * 60 * 1000);

  return newDate;
};

module.exports = { time, calculateDateAfterDays };
