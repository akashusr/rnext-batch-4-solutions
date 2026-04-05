import GithubSVG from "./svg/GithubSVG";
import LinkedInSVG from "./svg/LinkedInSVG";
import XSVG from "./svg/XSVG";

const Footer = () => {
  return (
    <div className="w-full lg:max-w-[1060px] lg:w-[1060px] mx-auto pt-10 flex flex-col justify-start items-start border-t border-[rgba(55,50,47,0.12)]">
      <div className="self-stretch h-auto flex flex-col md:flex-row justify-between items-stretch pr-0 pb-8 pt-0">
        <div className="h-auto p-4 md:p-8 flex flex-col justify-start items-start gap-8">
          <div className="self-stretch flex justify-start items-center gap-3">
            <div className="text-center text-[#49423D] text-xl font-semibold leading-4">
              Brillance
            </div>
          </div>
          <div className="text-[rgba(73,66,61,0.90)] text-sm font-medium leading-[18px]">
            Coding made effortless
          </div>
          <div className="flex justify-start items-start gap-4">
            <div className="w-6 h-6 relative overflow-hidden">
              <XSVG />
            </div>
            <div className="w-6 h-6 relative overflow-hidden">
              <LinkedInSVG />
            </div>
            <div className="w-6 h-6 relative overflow-hidden">
              <GithubSVG />
            </div>
          </div>
        </div>

        <div className="self-stretch p-4 md:p-8 flex flex-col sm:flex-row flex-wrap justify-start sm:justify-between items-start gap-6 md:gap-8">
          {footerMenus.map((menu) => (
            <div
              key={menu.id}
              className="flex flex-col justify-start items-start gap-3 flex-1 min-w-[120px]"
            >
              <div className="self-stretch text-[rgba(73,66,61,0.50)] text-sm font-medium leading-5">
                {menu.title}
              </div>
              <div className="flex flex-col justify-end items-start gap-2">
                {menu.items.map((item, index) => (
                  <div
                    key={index}
                    className="text-[#49423D] text-sm font-normal leading-5 cursor-pointer hover:text-[#37322F] transition-colors"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="self-stretch h-12 relative overflow-hidden border-t border-b border-[rgba(55,50,47,0.12)]">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <div className="w-full h-full relative"></div>
        </div>
      </div>
    </div>
  );
};

export default Footer;

const footerMenus = [
  {
    id: 1,
    title: "Product",
    items: [
      "Features",
      "Pricing",
      "Integrations",
      "Real-time Previews",
      "Multi-Agent Coding",
    ],
  },
  {
    id: 2,
    title: "Company",
    items: ["About us", "Our team", "Careers", "Brand", "Contact"],
  },
  {
    id: 3,
    title: "Resources",
    items: [
      "Terms of use",
      "API Reference",
      "Documentation",
      "Community",
      "Support",
    ],
  },
];
