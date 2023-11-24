import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Collapse, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, Navbar, NavbarBrand, NavbarToggler, UncontrolledDropdown } from "reactstrap"

import { faArrowRightToBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AppContext, AppContextType } from "context/AppContext";

import "bootstrap/dist/css/bootstrap.css";
import "./styles.css"

type NavbarAppProps = {
    title?: string;
}

export const NavbarApp = ({ title }: NavbarAppProps) => {
    const { jwtToken } = useContext(AppContext) as AppContextType;
    const [collapsed, setCollapsed] = useState(false);
    const toggleNavbar = () => setCollapsed(!collapsed);
    const navigate = useNavigate();

    return (
        <Navbar id="app-navbar"
            className="position-relative border-bottom border-2 user-select-none"
            expand={"md"}
        >
            <NavbarBrand href="/">
                IoWA Chat
            </NavbarBrand>
            <NavbarToggler onClick={toggleNavbar} />
            <Collapse isOpen={!collapsed} navbar>
                <span id='navbar-title'
                    className="position-absolute text-center fs-3 fw-bold"
                >
                    {title}
                </span>
                <Nav navbar className="ms-auto">
                    <NavItem className="pe-2">
                        {
                            jwtToken ?
                                <UserIcon />
                                :
                                <LoginButton onClick={() => navigate("/login")} />
                        }
                    </NavItem>
                </Nav>
            </Collapse>
        </Navbar>
    )
}

const UserIcon = () => {
    const { signOut } = useContext(AppContext) as AppContextType;
    const navigate = useNavigate();

    return (
        <div id="user-icon">
            <UncontrolledDropdown>
                <DropdownToggle
                    className="fs-4"
                    color="light"
                >
                    <FontAwesomeIcon icon={faUser} />
                </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem className="no-active"
                        onClick={() => navigate(`/profile`)}
                    >
                        <span>
                            Profile
                        </span>
                    </DropdownItem>
                    <DropdownItem className="no-active"
                        onClick={signOut}
                    >
                        <span className="text-danger">
                            Sign Out
                        </span>
                    </DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>
        </div>
    )
}

type LoginButtonProps = {
    onClick: () => void;
}

const LoginButton = ({ onClick }: LoginButtonProps) => (
    <div id='login-btn'
        className="
            icon
            px-3 py-2
            border border-1 border-dark rounded-3
            d-flex align-items-center
        "
        onClick={onClick}
    >
        <span>Log in</span>
        <FontAwesomeIcon className="ms-2 fs-4" icon={faArrowRightToBracket} />
    </div>
)
