import { ChangeEvent, useContext, useEffect, useRef, useState } from "react"
import { Button, FormFeedback, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, ModalProps } from "reactstrap";

import { AppContext, AppContextType } from "context/AppContext"

import { CloseButton } from "components/CloseButton";
import { ProfilePhoto } from "components/User";

import { UserDoc } from "interface/UserCredentials";
import { blobToB64Async } from "helpers/blobs";

import "bootstrap/dist/css/bootstrap.css";

interface EditProfileModalProps extends ModalProps {
    toggle: () => void;
}

export const EditProfileModal = ({isOpen, toggle}:EditProfileModalProps): JSX.Element => {
    const { editProfile, userDoc } = useContext(AppContext) as AppContextType;
    
    const [newUserData, setNewUserData] = useState<UserDoc | null>(userDoc);
    const [edittedKeys, setEdditedKeys] = useState<Set<keyof UserDoc>>(new Set());

    const [photoHover, setPhotoHover] = useState<boolean>(false);
    const [deleteHover, setDeleteHover] = useState<boolean>(false);

    const imageInputRef = useRef<HTMLInputElement | null>(null);

    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setNewUserData(userDoc);
        setEdditedKeys(new Set());
    }, [isOpen])

    if (!userDoc || !newUserData) return <></>;

    const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const editted = e.target.id as keyof Omit<UserDoc, "id">;
        const newValue = e.target.value;
        setNewUserData(oldData => {
            if (!oldData) return null;
            const newData = {...oldData};
            newData[editted] = newValue;
            return newData;
        })
        setEdditedKeys(oldKeys => oldKeys.add(editted));
    }

    const onPhotoChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const newPhoto = e.target.files?.item(0);
        if (!newPhoto) return;
        const base64Image = await blobToB64Async(newPhoto);
        setNewUserData({...newUserData, photo: base64Image});
        setEdditedKeys(oldKeys => oldKeys.add("photo"));
    }

    const onPhotoDelete = () => {
        if (edittedKeys.has("photo")) {
            setNewUserData({...newUserData, photo: userDoc.photo});
            edittedKeys.delete("photo");
        }
        else {
            setNewUserData({...newUserData, photo: null});
            setEdditedKeys(oldKeys => oldKeys.add("photo"));
        }
        setDeleteHover(false);
    }

    const onSave = async () => {
        setLoading(true);
        const res = await editProfile(newUserData, Array.from(edittedKeys));
        if (res) toggle();
        setLoading(false);
    }

    return (
        <Modal
            isOpen={isOpen}
            toggle={toggle}
            size="lg"
            keyboard={false}
        >
            <ModalHeader
                className="position-relative"
            >
                <span className="fs-3 fw-bold">Edit Profile</span>
                <CloseButton
                    onClick={toggle}
                    className="my-auto"
                    style={{
                        right: 15,
                        top: 0,
                        bottom: 0
                    }}
                />
            </ModalHeader>
            <ModalBody>
                <div className="d-flex align-items-center justify-content-between pe-5">
                    <div className="w-50">
                        <FormGroup id="name">
                            <Label
                                htmlFor="name"
                            >
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={newUserData.name}
                                invalid={newUserData.name.trim().length === 0}
                                onChange={onTextChange}
                            />
                            <FormFeedback>
                                You can't have no name!
                            </FormFeedback>
                        </FormGroup>
                        <FormGroup id="link">
                            <Label
                                htmlFor="link"
                            >
                                Link
                            </Label>
                            <Input
                                id="link"
                                value={newUserData.link ?? ""}
                                placeholder="https://yoursocial.com"
                                onChange={onTextChange}
                            />
                        </FormGroup>
                    </div>
                    <ProfilePhoto
                        id="profile-photo"
                        className="pointer position-relative me-3"
                        onMouseEnter={() => setPhotoHover(true)}
                        onMouseLeave={() => setPhotoHover(false)}        
                        style={{
                            backgroundColor: `${photoHover && !deleteHover ? "#AAAAAA" : ""}`,
                            opacity: `${photoHover && !deleteHover ? "50%" : ""}`,
                            color: `${photoHover && !deleteHover ? "white" : ""}`,
                        }}
                        user={newUserData}
                        size={{
                            width: 150,
                            height: 150
                        }}
                    >
                        {
                            photoHover && !deleteHover ?
                            <div
                                className="
                                    fs-2 text-dark
                                    pointer
                                    position-absolute
                                    d-flex align-items-center justify-content-center
                                "
                                style={{
                                    width: 150,
                                    height: 150,
                                }}
                                onClick={() => imageInputRef.current?.click()}
                            >
                                Edit
                                <input
                                    ref={imageInputRef}
                                    id="photo"
                                    type="file"
                                    accept="image/jpeg"
                                    onChange={onPhotoChange}
                                    hidden
                                />
                            </div>
                            : null
                        }
                        {
                            newUserData.photo ?
                            <CloseButton
                                onMouseEnter={() => setDeleteHover(true)}
                                onMouseLeave={() => setDeleteHover(false)}
                                onClick={onPhotoDelete}
                                style={{
                                    top: -5,
                                    right: -5
                                }}
                            />
                            : null
                        }
                    </ProfilePhoto>
                </div>
                <FormGroup id="description">
                    <Label
                        htmlFor="description"
                    >
                        Description
                    </Label>
                    <Input
                        id="description"
                        type="textarea"
                        style={{
                            resize: "none"
                        }}
                        value={newUserData.description ?? ""}
                        onChange={onTextChange}
                    />
                </FormGroup>
                <div id="buttons"
                    className="d-flex justify-content-between"
                >
                    <Button
                        color="danger"
                        onClick={toggle}
                    >
                        Cancel
                    </Button>
                    <Button
                        color="primary"
                        disabled={loading || edittedKeys.size === 0 || newUserData.name.trim().length === 0}
                        onClick={onSave}
                    >
                        Save Changes
                    </Button>
                </div>
            </ModalBody>
        </Modal>
    )
}