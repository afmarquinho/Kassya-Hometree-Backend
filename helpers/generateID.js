const generateID = () => {
  return (
    Math.random().toString(32).substring(2) +
    Date.now().toString(32) +
    Math.random().toString(32).substring(2)
  );
};

export default generateID;
