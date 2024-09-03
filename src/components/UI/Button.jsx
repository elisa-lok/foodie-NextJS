export default function Button({ children, textButton, className, ...props }) {
  let buttonClasses = textButton ? "text-button" : "button";
  buttonClasses += " " + className;
  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
}
