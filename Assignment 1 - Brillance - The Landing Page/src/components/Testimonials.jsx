import Heading from "./shared/Heading";
import TestimonialSVG from "./svg/TestimonialSVG";

const Testimonials = () => {
  return (
    <div className="w-full border-b border-[rgba(55,50,47,0.12)] flex flex-col justify-center items-center">
      {/* <!-- Header --> */}
      <div className="self-stretch px-4 sm:px-6 md:px-24 py-8 sm:py-12 md:py-16 border-b border-[rgba(55,50,47,0.12)] flex justify-center items-center gap-6">
        <div className="w-full max-w-[586px] px-4 sm:px-6 py-4 sm:py-5 shadow-none overflow-hidden rounded-lg flex flex-col justify-start items-center gap-3 sm:gap-4">
          {/* <!-- Badge --> */}
          <div className="px-[14px] py-[6px] bg-white shadow-[0px_0px_0px_4px_rgba(55,50,47,0.05)] overflow-hidden rounded-[90px] flex justify-start items-center gap-[8px] border border-[rgba(2,6,23,0.08)] shadow-xs">
            <TestimonialSVG />
            <div className="text-center flex justify-center flex-col text-[#37322F] text-xs font-medium leading-3">
              Testimonials
            </div>
          </div>
          <Heading
            header="Confidence backed by results"
            subHeader="Our customers achieve more each day"
            subHeader2="because their tools are simple, powerful, and clear."
          />
        </div>
      </div>

      <div className="self-stretch px-2 overflow-hidden flex justify-start items-center bg-background border border-b border-l-0 border-r-0 border-t-0">
        <div className="flex-1 py-12 md:py-16 flex flex-col md:flex-row justify-center items-end gap-6">
          <div className="self-stretch px-3 md:px-12 justify-center items-start gap-4 flex flex-col md:flex-row">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Sep%2011%2C%202025%2C%2011_35_19%20AM-z4zSRLsbOQDp7MJS1t8EXmGNB6Al9Z.png"
              alt="Jamie Marshall"
              className="w-48 h-50 rounded-lg object-cover"
            />

            <div className="flex-1 px-6 py-6 shadow-[0px_0px_0px_0.75px_rgba(50,45,43,0.12)] overflow-hidden flex flex-col justify-start items-start gap-6">
              <div className="self-stretch justify-start flex flex-col text-[#49423D] text-2xl md:text-[32px] font-medium leading-10 md:leading-[42px] h-auto tracking-tight">
                "In just a few minutes, we transformed our data into actionable
                insights. The process was seamless and incredibly efficient!"
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-1">
                <div className="self-stretch justify-center flex flex-col text-[rgba(73,66,61,0.90)] text-lg font-medium leading-[26px]">
                  Jamie Marshall
                </div>
                <div className="self-stretch justify-center flex flex-col text-[rgba(73,66,61,0.70)] text-lg font-medium leading-[26px]">
                  Co-founder, Exponent
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
