import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

import "bootstrap/dist/css/bootstrap.css";
import "./styles.css"

export const CloseButton = ({className, onClick, ...HTMLProps}: React.HTMLAttributes<HTMLDivElement>): JSX.Element => (
    <div id="close-button"
        {...HTMLProps}
        className={`
            p-3
            position-absolute
            border border-danger rounded-circle
            d-flex align-items-center justify-content-center
            ${className}
        `}
        onClick={onClick}
    >
        <FontAwesomeIcon
            icon={faX}
        />
    </div>
)