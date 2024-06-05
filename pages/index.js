import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import axios from "axios";


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

export default function Auth({username: user, secret: pass}) {
    const [username, setUsername] = useState(user)
    const [secret, setSecret] = useState(pass)
    const router = useRouter();

    function onSubmit(e) {
        e.preventDefault();
        if (username.length === 0 || secret.length === 0) return;

        axios
            .put(
                "https://api.chatengine.io/users/",
                {username, secret},
                {headers: {"Private-key": "8d70d8f8-5e54-4795-aebd-b103ad3e58e7"}}
            )
            .then(async r => {
                document.cookie = `username=${r?.data?.username}`
                document.cookie = `secret=${secret}`
                await router.push("/chats")
            })
    }

    useEffect(() => {
        if (username.length !== 0 || secret.length !== 0) {
            router.push("/chats").then(() => {
                console.log('Redirecting to chats page');
            })
        }
    }, [])

    return (
        <div className="background">
            <div className="auth-container">
                <form className="auth-form" onSubmit={(e) => onSubmit(e)}>
                    <div className="auth-title">E-Chat</div>
                    <div className="input-container">
                        <input
                            placeholder="Username"
                            className="text-input"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="input-container">
                        <input
                            type="password"
                            placeholder="Password"
                            className="text-input"
                            onChange={(e) => setSecret(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="submit-button">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
