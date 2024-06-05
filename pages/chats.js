import React, {useState, useEffect} from "react";
import {useRouter} from "next/router";
import dynamic from "next/dynamic";

const ChatEngine = dynamic(() =>
    import("react-chat-engine").then((module) => module.ChatEngine)
)

const MessageFormSocial = dynamic(() =>
    import("react-chat-engine").then((module) => module.MessageFormSocial)
)

export async function getServerSideProps(context) {
    let username = context?.req.cookies['username'];
    let secret = context?.req.cookies['secret'];

    return {
        props: {
            username: username ?? "",
            secret: secret ?? "",
        }
    }
}

export default function Chats({username, secret}) {
    const [showChat, setShowChat] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (typeof document !== null) {
            setShowChat(true);
        }
    })

    useEffect(() => {
        if (username?.length === 0 || secret?.length === 0) router.push("/");
    })

    if (!showChat) return <div/>

    return (
        <>
            <div className="background">
                <div className="shadow">
                    <ChatEngine
                        height="calc(100vh - 200px)"
                        projectID="60a07fcd-3c86-45b6-baf3-25726c7e06cb"
                        userName={username}
                        userSecret={secret}
                        renderNewMessageForm={() => <MessageFormSocial/>}
                    />
                </div>
            </div>
            <div style={{
                position: "fixed",
                top: '20px',
                right: "20px",
            }}>
                <button style={{minWidth: "200px"}} type="button" className="submit-button" onClick={async () => {
                    document.cookie = `username=`
                    document.cookie = `secret=`
                    await router.push('/')
                }}>
                    Log out
                </button>
            </div>
            <div style={{
                position: "fixed",
                top: '20px',
                left: "20px",
            }}>
                <button style={{minWidth: "150px"}} className="submit-button">
                    User: {username}
                </button>
            </div>
        </>
    );
}