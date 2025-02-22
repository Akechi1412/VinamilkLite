import PropTypes from 'prop-types';

function TextArea({ placeholder, value, id, name, handleChange, handleFocus }) {
  return (
    <textarea
      id={id}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={handleChange}
      onFocus={handleFocus}
      className="w-full h-[109px] flex rounded-[8px] min-w-0 p-[16px] bg-transparent border border-vinamilk-blue form-input font-lora text-[16px] text-vinamilk-blue placeholder:text-[16px] placeholder:text-vinamilk-blue-light leading-[19px] outline-none focus:border-vinamilk-blue-light resize-y"
    ></textarea>
  );
}

TextArea.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  handleChange: PropTypes.func,
  handleFocus: PropTypes.func,
  id: PropTypes.string,
  name: PropTypes.string,
};

export default TextArea;
