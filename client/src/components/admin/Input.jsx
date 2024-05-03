import PropTypes from 'prop-types';

function Input({ type, placeholder, value, handleChange, id, name }) {
  return (
    <input
      type={type}
      className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      id={id}
      name={name}
    />
  );
}

Input.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.any,
  handleChange: PropTypes.func,
  id: PropTypes.string,
  name: PropTypes.string,
};

export default Input;
