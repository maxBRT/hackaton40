import {Avatar, AvatarFallback, AvatarImage} from "@radix-ui/react-avatar";
import React from "react";
import {createAvatar} from "@dicebear/core";
import {thumbs} from "@dicebear/collection";

interface UserAvatarProps {
    userId: string
}

const UserAvatar: React.FC<UserAvatarProps> = ({userId}) => {
    const avatar = createAvatar(thumbs, { seed: userId }).toDataUri()
    return (
        <Avatar className="w-8 h-8">
            <AvatarImage src={avatar} className="rounded-full" />
            <AvatarFallback>U</AvatarFallback>
        </Avatar>
    )
}

export default UserAvatar