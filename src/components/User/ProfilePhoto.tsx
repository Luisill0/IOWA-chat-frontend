import { PropsWithChildren } from "react";

import { UserDoc } from "interface/UserCredentials";

import "bootstrap/dist/css/bootstrap.min.css";

interface ProfilePhotoProps extends React.HTMLAttributes<HTMLDivElement>, PropsWithChildren {
    user: UserDoc;
    size: {
        width: number;
        height: number;
    }
}

export const ProfilePhoto = ({user, size, children, className, style, ...HTMLProps}: ProfilePhotoProps): JSX.Element => {
    const Photo = () => (
        <img id="photo"
            draggable={false}
            src={user.photo!}
            alt="profile picture"
            className="rounded-circle border border-2 border-black"
            style={{
                width: `${size.width}px`,
                height: `${size.height}px`
            }}
        />
    )

    const Initial = () => (
        <span
            style={{
                fontSize: `${size.width * 0.6}px`
            }}
        >
            {user.username.charAt(0).toUpperCase()}
        </span>
    )
    
    return (
        <div
            {...HTMLProps}
            className={`
                d-flex align-items-center justify-content-center
                user-select-none
                border border-black rounded-circle
                ${className}
            `}
            style={{
                ...style,
                width: `${size.width}px`,
                height: `${size.height}px`
            }}
        >
            {   
                user.photo
                ? <Photo />
                : <Initial />
            }
            {children}
        </div>
    )
}
