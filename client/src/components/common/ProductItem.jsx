import PropTypes from 'prop-types';
import DefaultProduct from '../../assets/images/default-product.png';
import AddIcon from '../../assets/images/add.svg';
import { Link } from 'react-router-dom';

function ProductItem({ product }) {
  return (
    <Link to={`/products/${product.slug}`} className="flex flex-col animate-appear">
      <div className="aspect-square relative rounded-2xl shadow-sm border overflow-hidden">
        <img
          className="transition-all w-full h-full object-cover hover:scale-125"
          src={product.thumbnail || DefaultProduct}
          alt={product.name || ''}
        />
        <button
          onClick={(event) => {
            event.preventDefault();
          }}
        >
          <img className="w-10 h-10 absolute right-4 bottom-4" src={AddIcon} alt="" />
        </button>
      </div>
      <div className="flex-1">
        <h5 className="line-clamp-2 font-inter font-[600] text-primary my-3">{product.name}</h5>
        {product.sale_price !== null ? (
          <p className="font-inter text-[18px] mt-auto flex space-x-2">
            <span className="line-through text-[#999]">{product.price}₫</span>
            <span className="text-primary">{product.sale_price}₫</span>
          </p>
        ) : (
          <p className="font-light text-[18px] text-primary">{product.price}</p>
        )}
      </div>
    </Link>
  );
}

ProductItem.propTypes = {
  product: PropTypes.object.isRequired,
};

export default ProductItem;
