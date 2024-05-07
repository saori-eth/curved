import { UserAvatar } from "./UserAvatar";
import { Username } from "./Username";

interface Props {
  avatar: string | null;
  username: string;
}

export async function ProfileSettings({ avatar, username }: Props) {
  return (
    <div className="flex items-center justify-center space-x-2 pb-2 md:pb-0">
      <UserAvatar username={username} avatar={avatar} />
      <Username username={username} />
    </div>
  );
}
