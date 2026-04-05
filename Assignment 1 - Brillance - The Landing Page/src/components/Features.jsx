import { features } from "../static/data";
import FeatureSVG from "./svg/FeatureSVG";
import FeatureCard from "./UI/cards/FeatureCard";

const Features = () => {
  return (
    <div>
      <div className="absolute top-[232px] sm:top-[248px] md:top-[264px] lg:top-[320px] left-1/2 transform -translate-x-1/2 z-0 pointer-events-none">
        <FeatureSVG />
      </div>

      <div className="self-stretch border-t border-[#E0DEDB] border-b border-[#E0DEDB] flex justify-center items-start mt-60">
        {/* <!-- Left Pattern --> */}
        <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
          <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
            <template id="pattern-template">
              <div className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
            </template>
          </div>
        </div>

        {/* <!-- Feature Cards --> */}
        <div className="flex-1 px-0 sm:px-2 md:px-0 flex flex-col md:flex-row justify-center items-stretch gap-0">
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              title={feature.title}
              description={feature.description}
              image={feature.image}
            />
          ))}
        </div>

        {/* <!-- Right Pattern --> */}
        <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
          <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
            <template id="pattern-template-2">
              <div className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
            </template>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
