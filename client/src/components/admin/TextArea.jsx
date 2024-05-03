import PropTypes from 'prop-types';

function TextArea({ placeholder, value, id, name, handleChange }) {
  return (
    <textarea
      id={id}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={handleChange}
      className="w-full h-[109px] p-[16px] rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
    ></textarea>
  );
}

TextArea.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  handleChange: PropTypes.func,
  id: PropTypes.string,
  name: PropTypes.string,
};

export default TextArea;
