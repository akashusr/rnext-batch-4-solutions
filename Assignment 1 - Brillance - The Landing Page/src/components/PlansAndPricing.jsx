import Heading from "./shared/Heading";
import PlansSVG from "./svg/PlansSVG";

const PlansAndPricing = () => {
  return (
    <div className="w-full flex flex-col justify-center items-center gap-2 border-b border-[rgba(55,50,47,0.12)]">
      {/* <!-- Pricing Header --> */}
      <div className="self-stretch px-6 md:px-24 py-12 md:py-16 border-b border-[rgba(55,50,47,0.12)] flex justify-center items-center gap-6">
        <div className="w-full max-w-[586px] px-6 py-5 shadow-none overflow-hidden rounded-lg flex flex-col justify-start items-center gap-4">
          <div className="px-[14px] py-[6px] bg-white shadow-[0px_0px_0px_4px_rgba(55,50,47,0.05)] overflow-hidden rounded-[90px] flex justify-start items-center gap-[8px] border border-[rgba(2,6,23,0.08)] shadow-xs">
            <PlansSVG />
            <div className="text-center flex justify-center flex-col text-[#37322F] text-xs font-medium leading-3">
              Plans & Pricing
            </div>
          </div>
          <Heading
            header="Choose the perfect plan for your business"
            subHeader="Scale your operations with flexible pricing that grows with your
            team."
            subHeader2="Start free, upgrade when you're ready."
          />
        </div>
      </div>
    </div>
  );
};

export default PlansAndPricing;
