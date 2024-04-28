const Pill = ({text, onClick}) => {
  return (
    <span className="user-pill" onClick={onClick}>
      <span>{text}</span>
    </span>
  );
};

export default Pill;