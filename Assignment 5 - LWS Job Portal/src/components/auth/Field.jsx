import React from "react";

const Field = ({ label, children, htmlFor, error }) => {
  const id = htmlFor || getChildId(children);
  return (
    <div className="form-control">
      {label && (
        <label htmlFor={id} className="level font-semibold text-sm">
          {label}
        </label>
      )}
      {children}
      {!!error && <div className="text-red-500">{error.message}</div>}
    </div>
  );
};

const getChildId = (children) => {
  const child = React.Children.only(children);

  if (child?.props && "id" in child.props) {
    return child.props.id;
  }
};

export default Field;
