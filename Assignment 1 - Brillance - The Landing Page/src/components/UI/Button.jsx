const Button = ({ title }) => {
  return (
    <div className="backdrop-blur-[8.25px] flex justify-start items-center gap-4">
      <div className="h-10 sm:h-11 md:h-12 px-6 sm:px-8 md:px-10 lg:px-12 py-2 sm:py-[6px] relative bg-[#37322F] shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset] overflow-hidden rounded-full flex justify-center items-center">
        <div className="w-20 sm:w-24 md:w-28 lg:w-44 h-[41px] absolute left-0 top-[-0.5px] bg-gradient-to-b from-[rgba(255,255,255,0)] to-[rgba(0,0,0,0.10)] mix-blend-multiply"></div>
        <div className="flex flex-col justify-center text-white text-sm sm:text-base md:text-[15px] font-medium leading-5">
          {title}
        </div>
      </div>
    </div>
  );
};

export default Button;
