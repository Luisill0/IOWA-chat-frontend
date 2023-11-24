import { useContext, useState } from "react";
import { Button, Col, Row } from "reactstrap";

import { NavbarApp } from "components/Navbar";
import { EditProfileModal, ProfilePhoto } from "components/User";
import { AppContext, AppContextType } from "context/AppContext";
import { UserDoc } from "interface/UserCredentials";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChain } from "@fortawesome/free-solid-svg-icons";

type ProfileProps = {
    user: UserDoc;
}

export const Profile = ({ user }: ProfileProps) => {
    const { userDoc } = useContext(AppContext) as AppContextType;
    const [myProfile] = useState<boolean>(userDoc?.username === user.username);

    const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
    const toggleEditModal = () => setEditModalOpen(!editModalOpen);

    const EditButton = (): JSX.Element => {
        if (!myProfile) return <></>
        return (
            <Button
                color="primary"
                className="ms-3 px-2 btn-faded"
                onClick={toggleEditModal}
            >
                Edit Profile
            </Button>
        )
    }

    const UserLink = (): JSX.Element => {
        if (!user.link) return <></>
        return (
            <div className="mt-2">
                <a href={user.link} target="_blank">
                    <FontAwesomeIcon className="me-1" icon={faChain} />
                    {user.link}
                </a>
            </div>
        )
    }

    return (
        <div id='profile-page'>
            <NavbarApp />
            <EditProfileModal isOpen={editModalOpen} toggle={toggleEditModal} />
            <div id="content"
                className="pt-3 px-5 mx-5"
            >
                <Row>
                    <Col xs={6}>
                        <div className="d-flex align-items-center">
                            <span className="fs-1 fw-bold">{user.username}</span>
                            <EditButton />
                        </div>
                        <span className="fs-5">{user.name}</span>
                        <UserLink />
                    </Col>
                    <Col xs={6}
                        className="d-flex justify-content-end pe-5"
                    >
                        <ProfilePhoto user={user} size={{width: 200, height: 200}} />
                    </Col>
                </Row>
                <div id="description-box"
                    className="mt-3 px-3 py-2 border border-black rounded-4"
                >
                    {user.description ?? `Hey there! I'm ${user.name}`}
                </div>
            </div>
        </div>
    )
}