import PropTypes from 'prop-types';
import { ProductItem } from './';

function ProductList({ productList }) {
  return (
    <div className="flex flex-wrap -mx-3 md:-mx-2 sm:px-4 overflow-hidden">
      {productList.map((product) => (
        <div
          className="w-1/4 lg:w-1/3 md:w-1/2 sm:w-full md:-px-2 px-3 mb-10 md:mb-8 sm:mb-5"
          key={product.id}
        >
          <ProductItem product={product} />
        </div>
      ))}
    </div>
  );
}

ProductList.propTypes = {
  productList: PropTypes.array.isRequired,
};

export default ProductList;
