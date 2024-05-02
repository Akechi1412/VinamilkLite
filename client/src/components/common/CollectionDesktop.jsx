import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import DefaultImage from '../../assets/images/default.jpg';

function CollectionDesktop({ collectionList }) {
  const [hoveredCollection, setHoveredCollection] = useState(collectionList[0] || null);

  useEffect(() => {
    if (!hoveredCollection) {
      setHoveredCollection(collectionList[0] || null);
    }
  }, [collectionList]);

  return (
    <div className="flex flex-wrap -mx-3 h-[880px]">
      <div className="w-1/2 px-3">
        <img
          className="object-cover block w-full h-full rounded-[20px]"
          src={hoveredCollection?.image || DefaultImage}
          alt={hoveredCollection?.name || 'Bộ sưu tập'}
        />
      </div>
      <div className="w-1/2 px-3 flex flex-col overflow-y-auto no-scrollbar space-y-4 h-full">
        {collectionList.map((collection) => (
          <a
            key={collection.id}
            className="rounded-[20px] block border border-primary bg-secondary text-primary font-inter px-8 py-12 lg:px-6 lg:py-10 text-[2rem] leading-[0.95] hover:underline"
            onMouseEnter={() => setHoveredCollection(collection)}
            href={`/collections/${collection?.slug}`}
          >
            {collection.name}
          </a>
        ))}
      </div>
    </div>
  );
}

CollectionDesktop.propTypes = {
  collectionList: PropTypes.array.isRequired,
};

export default CollectionDesktop;
