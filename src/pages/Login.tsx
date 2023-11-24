import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom";
import { Button, Form, FormFeedback, FormGroup, Input, InputGroup, InputGroupText, Label, Spinner } from "reactstrap";

import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { UserCredentials } from "interface/UserCredentials";
import { ErrorResponse } from "interface/ErrorResponse";
import { AppContext, AppContextType } from "context/AppContext";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

export const Login = () => {
    const { login } = useContext(AppContext) as AppContextType;

    const [username, setUserName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    
    const [error, setError] = useState<ErrorResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [toggling, setToggling] = useState<boolean>(false);

    const navigate = useNavigate();

    const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const credentials: UserCredentials = {
            username: username,
            password: password
        }

        const error = await login(credentials);
        if (!error) navigate("/");
        setError(error);
        setLoading(false);
    }

    return (
        <div id="log-page"
            className="
                w-75
                pt-2
                mx-auto
            "
        >
            <div
                className="pt-2 mb-3 fs-3 fw-bold"
            >
                Log In
            </div>
            <span>
                New user? &nbsp;
                <span
                    className="pointer text-primary text-decoration-underline"
                    onClick={() => navigate("/sign-up")}
                >
                    Sign Up
                </span>
            </span>
            <Form onSubmit={onLogin}>
                <FormGroup
                    className="mt-2"
                >
                    <Label
                        htmlFor="username"
                    >
                        Username:
                    </Label>
                    <Input
                        value={username}
                        invalid={error !== null}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Enter username"
                        className="no-focus"
                    />
                    <FormFeedback>
                        Wrong username or password!
                    </FormFeedback>
                </FormGroup>
                <FormGroup
                    className="mt-2"
                >
                    <Label
                        htmlFor="password"
                    >
                        Password:
                    </Label>
                    <InputGroup>
                        <Input
                            type={toggling ? "text" : "password"}
                            value={password}
                            invalid={error !== null}
                            onChange={(e) => setPassword(e.target.value)}
                            className="no-focus"
                            placeholder="Enter password"
                        />
                        <InputGroupText id='view-password'
                            onMouseDown={() => setToggling(true)}
                            onMouseUp={() => setToggling(false)}
                            onMouseLeave={() => setToggling(false)}
                        >
                            <FontAwesomeIcon icon={faEye} />
                        </InputGroupText>
                    </InputGroup>
                </FormGroup>
                <Button id="btn-create"
                    className="mt-3"
                    color="primary"
                    type="submit"
                    disabled={loading}
                >
                    {
                        loading ? 
                        <Spinner />
                        :
                        "Log In"
                    }
                </Button>
            </Form>
        </div>
    )
}
