export const getReason = (message) => {
  // Find the JSON string within the provided string using a regular expression
  const regex = /error=\{(.*?)\}, tx=/;
  const match = message.match(regex);

  // If found, parse the JSON string and extract the reason
  if (match && match[1]) {
    const json = JSON.parse(`{${match[1]}}`);
    return json.reason;
  }
  return null;
};
