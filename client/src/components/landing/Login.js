import React, { Fragment, useState } from "react";

// Login using email or username
const Login = ({ setAuth }) => {

    const [inputs, setInputs] = useState({
        email: "",
        password: ""
    });

    // email const can be either an email address or username
    const { email, password } = inputs;

    const onChange = e =>
        setInputs({ ...inputs, [e.target.name]: e.target.value });

    const onSubmitForm = async e => {
        e.preventDefault();
        try {
            const body = { email, password };
            // convert email to lowercase
            body.email = body.email.toLowerCase();

            const response = await fetch(
                "http://" + window.location.host + ":5000/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify(body)
                }
            );

            const parseResponse = await response.json();

            if (parseResponse.token) {
                localStorage.setItem("token", parseResponse.token);
                setAuth(true);
            } else {
                setAuth(false);
            }
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <Fragment>
            {/* <!-- Button trigger modal --> */}
            <button type="button" className="btn btn-primary button" data-bs-toggle="modal" data-bs-target="#login">
                Log in
            </button>

            {/* <!-- Modal --> */}
            <div className="modal fade" id="login" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Log in to your account</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={onSubmitForm} className="signup-form">
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Email or Username"
                                    name="email"
                                    value={email}
                                    onChange={onChange}
                                />
                                <input
                                    className="form-control"
                                    type="password"
                                    placeholder="Password"
                                    name="password"
                                    value={password}
                                    onChange={onChange}
                                />
                                <button className="btn btn-primary" data-bs-dismiss="modal" aria-label="Close">Log in</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default Login;