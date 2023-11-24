import { NavbarApp } from "components/Navbar"
import { Button } from "reactstrap"

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

export const Home = () => {
    return (
        <div id='home-page'>
            <NavbarApp />
            <div id='navigate'>
                <Button color="primary"
                    className="btn-faded"
                >
                    Global Chat
                </Button>
                <Button color="primary"
                    className="btn-faded"
                >
                    Profile
                </Button>
            </div> 
        </div>
    )
}
