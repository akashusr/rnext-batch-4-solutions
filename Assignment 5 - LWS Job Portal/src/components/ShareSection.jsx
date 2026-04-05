import { Facebook, Link, Linkedin, Twitter } from "lucide-react";

export const ShareSection = ({socialLinks}) => {
  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-4">Share this Job</h3>
      <div className="flex gap-2">
        <a href={socialLinks.linkedin} className="btn btn-outline flex-1 cursor-pointer" title="Share on LinkedIn">
          <Linkedin className="h-4 w-4"></Linkedin>
        </a>
        <a href={socialLinks.twitter} className="btn btn-outline flex-1 cursor-pointer" title="Share on Twitter">
          <Twitter className="h-4 w-4"></Twitter>
        </a>
        <a href={socialLinks.facebook} className="btn btn-outline flex-1 cursor-pointer" title="Share on Facebook">
          <Facebook className="h-4 w-4"></Facebook>
        </a>
        <a href='#' className="btn btn-outline flex-1 cursor-pointer" title="Copy link">
          <Link className="h-4 w-4"></Link>
        </a>
      </div>
    </div>
  );
};
