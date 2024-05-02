import PropTypes from 'prop-types';
import DefaultImage from '../../assets/images/default.jpg';
import AlternatingStripes from './AlternatingStripes';

function AboutSection({ bgColor, sectionData }) {
  return (
    <section>
      <div className="h-5">
        <AlternatingStripes firstColor="transparent" secondColor={bgColor} stripeWith={10} />
      </div>
      <div className="py-8 mb-[48px]" style={{ background: bgColor }}>
        <div className="container-sm px-[48px] md:px-[24px] sm:px-[16px]">
          <div>
            <div className="flex flex-wrap -mx-8 lg:flex-col lg:mx-0 lg:space-y-5">
              <div className="w-1/2 lg:w-full px-4 lg:px-0 text-white">
                <h3 className="font-vsd-regular text-[5rem] md:text-[3rem] tracking-wider">
                  {sectionData.title || ''}
                </h3>
                <p>{sectionData.description || ''}</p>
              </div>
              <div className="w-1/2 lg:w-full px-4 lg:px-0">
                <img
                  className="rounded-xl object-cover aspect-[3/2]"
                  src={sectionData.image || DefaultImage}
                  alt={sectionData.title || ''}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

AboutSection.propTypes = {
  bgColor: PropTypes.string.isRequired,
  sectionData: PropTypes.object.isRequired,
};

export default AboutSection;
