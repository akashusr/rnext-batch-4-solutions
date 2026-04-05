import React from "react";

const FeatureCard = ({ title, description, image }) => {
  return (
    <div className="w-full md:flex-1 self-stretch px-6 py-5 overflow-hidden flex flex-col justify-start items-start gap-2 cursor-pointer relative border-b md:border-b-0 border-l-0 border-r-0 md:border border-[#E0DEDB]/80">
      <div className="self-stretch flex justify-center flex-col text-[#49423D] text-sm md:text-sm font-semibold leading-6 md:leading-6">
        {title}
      </div>
      <div className="self-stretch text-[#605A57] text-[13px] md:text-[13px] font-normal leading-[22px] md:leading-[22px]">
        {description}
      </div>
      <img
        src={image}
        alt={title}
        className="w-full h-40 object-cover rounded-md mt-3"
      />
    </div>
  );
};

export default FeatureCard;
