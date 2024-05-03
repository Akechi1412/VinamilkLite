import PropTypes from 'prop-types';

function Button({ title, type = 'button', handleClick }) {
  return (
    <button
      onClick={handleClick}
      type={type}
      className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
    >
      {title}
    </button>
  );
}

Button.propTypes = {
  title: PropTypes.string.isRequired,
  type: PropTypes.string,
  handleClick: PropTypes.func,
};

export default Button;
