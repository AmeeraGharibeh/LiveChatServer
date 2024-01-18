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

  // Calculate the new date after the specified number of days
  const newDate = new Date(currentDate);
  newDate.setDate(currentDate.getDate() + days);

  return newDate;
};

module.exports = { time, calculateDateAfterDays };
