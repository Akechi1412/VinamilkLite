import PropTypes from 'prop-types';

function Button({ title, type = 'button', isDisable = false, handleClick }) {
  if (isDisable) {
    return (
      <button
        type={type}
        disabled
        onClick={handleClick}
        className="border-[1px] transition-all duration-200 rounded-full text-paragraph min-w-12 inline-flex items-center outline-none justify-center px-[32px] py-[15px] min-h-[56px] bg-[rgba(29,27,32,0.12)] text-[rgb(153,153,153)] border-transparent w-full h-[60px] font-normal cursor-default opacity-50 bg-black-400"
      >
        <div className="flex items-center text-center text-[16px] leading-[24px]">{title}</div>
      </button>
    );
  } else {
    return (
      <button
        type={type}
        onClick={handleClick}
        className="border-[1px] transition-all duration-200 rounded-full text-paragraph min-w-12 inline-flex items-center outline-none justify-center px-[32px] py-[15px] min-h-[56px] hover:bg-factory-blue hover:border-factory-blue active:bg-deep-blue active:border-deep-blue bg-primary text-secondary border-primary w-full h-[60px] font-normal"
      >
        <div className="flex items-center text-center text-[16px] leading-[24px]">{title}</div>
      </button>
    );
  }
}

Button.propTypes = {
  title: PropTypes.string.isRequired,
  type: PropTypes.string,
  handleClick: PropTypes.func,
  isDisable: PropTypes.bool,
};

export default Button;
