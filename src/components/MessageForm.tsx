import { FormEvent, useRef, useState } from "react";
import { Form, FormGroup, Input, InputGroup, InputGroupText } from "reactstrap";

import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "bootstrap/dist/css/bootstrap.css";
import "./styles.css"

type MessageFormProps = {
    onSendMessage: (e: FormEvent<HTMLFormElement>, message: string) => void;
}

export const MessageForm = ({onSendMessage}: MessageFormProps) => {
    const [writtenMessage, setWrittenMessage] = useState<string>('');
    
    const buttonSubmitRef = useRef<HTMLButtonElement | null>(null);

    return (
        <Form id='message-form'
            className="w-75 mx-auto"
            onSubmit={e => {
                onSendMessage(e, writtenMessage);
                setWrittenMessage('');
            }}
        >
            <FormGroup>
                <InputGroup>
                    <Input
                        className='no-focus'
                        value={writtenMessage}
                        onChange={e => setWrittenMessage(e.target.value)}
                    />
                    <InputGroupText id='send-icon'
                        onClick={() => buttonSubmitRef.current?.click()}
                    >
                    <FontAwesomeIcon icon={faPaperPlane} />
                    </InputGroupText>
                </InputGroup>
                <button id='hidden-submit'
                    ref={buttonSubmitRef}
                    type="submit"
                    style={hiddenButtonStyle}
                />
            </FormGroup>
        </Form>
    )
}

const hiddenButtonStyle: React.CSSProperties = {
    height: '0px',
    visibility: 'hidden'
}
