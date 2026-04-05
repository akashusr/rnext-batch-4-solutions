import { Camera, ChevronRight, Trash2, Upload, X } from "lucide-react";
import { Link } from "react-router-dom";
import EditProfileForm from "../../components/job-seeker/EditProfileForm";
import { useMe } from "../../hooks/useMe";
import { useUploadProfilePicture } from "../../hooks/useProfileUpload";

const EditUserProfile = () => {
  const { data: user, isLoading } = useMe();
  const { mutate } = useUploadProfilePicture();

  if (isLoading) return <h1 className="text-center">Loading...</h1>;

  const handleProfilePictureUpload = (file) => {
    if (!file) return;

    mutate(file, {
      onSuccess: () => {
        console.log("Uploaded successfully:");
      },
      onError: (data) => {
        console.log(data);
      },
    });
  };

  const { profilePictureUrl } = user;

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      {/* <!-- Page Header --> */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-[hsl(var(--color-muted-foreground))] mb-2">
          <Link
            to="/user-dashboard"
            className="hover:text-[hsl(var(--color-primary))]"
          >
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            to="/profile"
            className="hover:text-[hsl(var(--color-primary))]"
          >
            My Profile
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-[hsl(var(--color-foreground))]">
            Edit Profile
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Edit Profile</h1>
            <p className="text-[hsl(var(--color-muted-foreground))]">
              Update your personal information and preferences
            </p>
          </div>
          <Link to="/profile" className="btn btn-outline">
            <X className="h-4 w-4" />
            Cancel
          </Link>
        </div>
      </div>

      {/* <!-- Profile Photo Section --> */}
      <div className="card p-6 my-8">
        <h2 className="text-xl font-semibold mb-6">Profile Photo</h2>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative shrink-0">
            <div className="h-32 w-32 rounded-full bg-[hsl(var(--color-secondary))] flex items-center justify-center">
              <img
                src={`${import.meta.env.VITE_BASE_URL}${profilePictureUrl}`}
                data-lucide="user"
                className="h-30 w-30 rounded-full "
              />
            </div>
            <div className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-[hsl(var(--color-primary))] flex items-center justify-center border-4 border-white cursor-pointer hover:bg-[hsl(var(--color-primary))]/90 transition-colors">
              <Camera className="h-5 w-5 text-white"></Camera>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-medium mb-2">Upload Profile Picture</h3>
            <p className="text-sm text-[hsl(var(--color-muted-foreground))] mb-4">
              JPG, PNG or GIF. Max size of 5MB.
            </p>
            <div className="flex gap-2">
              <label className="btn btn-primary cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                Upload Photo
                <input
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={(e) =>
                    handleProfilePictureUpload(e.target.files[0])
                  }
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Edit Form --> */}
      <EditProfileForm user={user} />
    </main>
  );
};

export default EditUserProfile;
