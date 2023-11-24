import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom";
import { Button, Form, FormFeedback, FormGroup, Input, InputGroup, InputGroupText, Label, Spinner } from "reactstrap";

import { faCheck, faEye, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ErrorCode } from "helpers/errorCode";
import { ErrorResponse } from "interface/ErrorResponse";
import { AppContext, AppContextType } from "context/AppContext";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

export const SignUp = () => {
    const { signUp } = useContext(AppContext) as AppContextType;
    
    const [name, setName] = useState<string>("");
    const [username, setUserName] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [error, setError] = useState<ErrorResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [toggling, setToggling] = useState<boolean>(false);

    const navigate = useNavigate();

    const onCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const credentials = {
            name: name,
            username: username,
            password: password
        }

        const error = await signUp(credentials);
        setError(error);
        setLoading(false);
        if (!error) return navigate("/");
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
                Sign Up
            </div>
            <span>
                Already have an account? &nbsp;
                <span
                    className="pointer text-primary text-decoration-underline"
                    onClick={() => navigate("/login")}
                >
                    Log In
                </span>
            </span>
            <Form onSubmit={onCreate}>
                <FormGroup
                    className="mt-2"
                >
                    <Label
                        htmlFor="name"
                    >
                        Name:
                    </Label>
                    <Input
                        value={name}
                        invalid={error !== null && error.code !== ErrorCode.USERNAME_TAKEN}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="no-focus"
                        required
                    />
                    <FormFeedback>
                        Something went wrong. Try again later
                    </FormFeedback>
                </FormGroup>
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
                        invalid={error?.code === ErrorCode.USERNAME_TAKEN}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Enter username"
                        className="no-focus"
                        required
                    />
                    <FormFeedback>
                        {error?.message}
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
                            onChange={(e) => setPassword(e.target.value)}
                            className="no-focus"
                            placeholder="Enter password"
                            required
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
                <div id="passwd-list">
                    <LiWithCheck checked={password.length >= 8} label="8 characters min." />
                    <LiWithCheck checked={/\d/.test(password)} label="1 number" />
                    <LiWithCheck checked={/[A-Z]/.test(password)} label="1 capitalized letter" />
                    <LiWithCheck checked={/[ !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/.test(password)} label="1 special character" />
                </div>
                <Button id="btn-create"
                    className="mt-3"
                    color="primary"
                    type="submit"
                    disabled={
                        !(/^.*(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]).*$/.test(password))
                        || username.trim().length === 0 || name.trim().length === 0 || loading
                    }
                >
                    {
                        loading ? 
                        <Spinner />
                        :
                        "Create Account"
                    }
                </Button>
            </Form>
        </div>
    )
}

type LiWithCheckProps = {
    checked: boolean;
    label: string
}

const LiWithCheck = ({checked, label}: LiWithCheckProps) => (
    <div>
        <FontAwesomeIcon
            icon={checked ? faCheck : faXmark}
            className={`
                me-3
                ${checked ? "checked" : "unchecked"}
            `}
        />
        <span>{label}</span>
    </div>
)