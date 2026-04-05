
const Heading = ({ header, subHeader, subHeader2 }) => {
  return (
    <div>
      <div className="w-full max-w-[598.06px] lg:w-[598.06px] text-center flex justify-center flex-col text-[#49423D] text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold leading-tight md:leading-[60px] tracking-tight">
        {header}
      </div>
      <div className="self-stretch text-center text-[#605A57] text-sm sm:text-base font-normal leading-6 sm:leading-7">
        {subHeader}
        <br />
        {subHeader2}
      </div>
    </div>
  );
};

export default Heading;
