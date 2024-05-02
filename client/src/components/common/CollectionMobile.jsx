import PropTypes from 'prop-types';
import DefaultImage from '../../assets/images/default.jpg';

function CollectionMobile({ collectionList }) {
  return (
    <div className="flex space-x-4 overflow-x-auto snap-mandatory snap-x no-scrollbar">
      {collectionList.map((collection) => (
        <div className="snap-center flex flex-col space-y-3" key={collection.id}>
          <img
            className="object-cover rounded-[10px] w-full h-[260px]"
            src={collection?.image || DefaultImage}
            alt={collection?.name || 'Bộ sưu tập'}
          />
          <a
            className="flex-1 w-[208px] rounded-[10px] block border border-primary bg-secondary text-primary font-inter p-4 text-[1.25rem] leading-[0.95] hover:underline text-center"
            href={`/collections/${collection?.slug}`}
          >
            {collection.name}
          </a>
        </div>
      ))}
    </div>
  );
}

CollectionMobile.propTypes = {
  collectionList: PropTypes.array.isRequired,
};

export default CollectionMobile;
