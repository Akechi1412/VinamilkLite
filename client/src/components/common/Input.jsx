import { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Input = forwardRef(({ type = 'text', placeholder, value, handleChange, id, name }, ref) => {
  return (
    <input
      type={type}
      className="w-full h-[51px] flex rounded-[8px] min-w-0 px-[16px] bg-transparent border border-vinamilk-blue form-input font-lora text-[16px] text-vinamilk-blue placeholder:text-[16px] placeholder:text-vinamilk-blue-light leading-[19px] outline-none focus:border-vinamilk-blue-light"
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      id={id}
      name={name}
      ref={ref}
    />
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.any,
  handleChange: PropTypes.func,
  id: PropTypes.string,
  name: PropTypes.string,
};

export default Input;
