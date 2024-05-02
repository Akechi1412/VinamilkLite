import { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Input = forwardRef(
  ({ type = 'text', placeholder, value, handleChange, id, name, isDisable = false }, ref) => {
    return (
      <input
        type={type}
        className={
          `w-full h-[51px] flex rounded-[8px] min-w-0 px-[16px] bg-transparent border font-lora text-[16px] placeholder:text-[16px] placeholder:text-vinamilk-blue-light leading-[19px] outline-none focus:border-vinamilk-blue-light` +
          (isDisable
            ? 'cursor-default text-[rgb(153,153,153)] border-[rgb(153,153,153)]'
            : 'text-vinamilk-blue border-vinamilk-blue')
        }
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        id={id}
        name={name}
        ref={ref}
        disabled={isDisable}
      />
    );
  }
);

Input.displayName = 'Input';

Input.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.any,
  handleChange: PropTypes.func,
  id: PropTypes.string,
  name: PropTypes.string,
  isDisable: PropTypes.bool,
};

export default Input;
