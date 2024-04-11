import PropTypes from 'prop-types';

// eslint-disable-next-line react/prop-types
function Button({ disable = false }) {
  if (disable) {
    return <div></div>;
  }
  return <button></button>;
}

Button.prototype = {
  disable: PropTypes.bool,
};

export default Button;
