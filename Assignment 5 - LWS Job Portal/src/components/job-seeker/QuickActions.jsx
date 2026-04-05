import { Bookmark, Edit, FileText, Settings, User } from "lucide-react";
import { Link } from "react-router-dom";

const QuickActions = () => {
  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
      <div className="space-y-2">
        <Link
          to="/profile"
          className="flex items-center gap-3 p-3 rounded-md hover:bg-[hsl(var(--color-accent))] transition-colors"
        >
          <User
            className="h-5 w-5 text-[hsl(var(--color-muted-foreground))]"
          ></User>
          <span className="text-sm font-medium">View Profile</span>
        </Link>
        <Link
          to="/edit-user-profile"
          className="flex items-center gap-3 p-3 rounded-md hover:bg-[hsl(var(--color-accent))] transition-colors"
        >
          <Edit
            className="h-5 w-5 text-[hsl(var(--color-muted-foreground))]"
          ></Edit>
          <span className="text-sm font-medium">Edit Profile</span>
        </Link>
        <Link
          to="/applied-jobs"
          className="flex items-center gap-3 p-3 rounded-md hover:bg-[hsl(var(--color-accent))] transition-colors"
        >
          <FileText
            className="h-5 w-5 text-[hsl(var(--color-muted-foreground))]"
          ></FileText>
          <span className="text-sm font-medium">My Applications</span>
        </Link>
        <Link
          to="#"
          className="flex items-center gap-3 p-3 rounded-md hover:bg-[hsl(var(--color-accent))] transition-colors"
        >
          <Bookmark
            className="h-5 w-5 text-[hsl(var(--color-muted-foreground))]"
          ></Bookmark>
          <span className="text-sm font-medium">Saved Jobs</span>
        </Link>
        <Link
          to="#"
          className="flex items-center gap-3 p-3 rounded-md hover:bg-[hsl(var(--color-accent))] transition-colors"
        >
          <Settings
            className="h-5 w-5 text-[hsl(var(--color-muted-foreground))]"
          ></Settings>
          <span className="text-sm font-medium">Settings</span>
        </Link>
      </div>
    </div>
  );
};

export default QuickActions;
