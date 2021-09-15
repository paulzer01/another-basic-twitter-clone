import React, { Fragment, useState } from "react";

const Register = ({ setAuth }) => {

    const [inputs, setInputs] = useState({
        name: "",
        username: "",
        email: "",
        password: ""
    });

    const { name, username, email, password } = inputs;

    const onChange = e =>
        setInputs({ ...inputs, [e.target.name]: e.target.value });

    const onSubmitForm = async e => {
        e.preventDefault();
        try {
            const body = { name, username, email, password };
            // convert username and email to lowercase
            body.email = body.email.toLowerCase();
            body.username = body.username.toLowerCase();

            const response = await fetch(
                "/auth/register",
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
    }

    return (
        <Fragment>
            {/* <!-- Button trigger modal --> */}
            <button type="button" className="btn btn-primary button" data-bs-toggle="modal" data-bs-target="#register">
                Sign up
            </button>

            {/* <!-- Modal --> */}
            <div className="modal fade" id="register" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Create your account</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={onSubmitForm} className="signup-form">
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Name"
                                    name="name"
                                    value={name}
                                    onChange={onChange}
                                />
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Username"
                                    name="username"
                                    value={username}
                                    onChange={onChange}
                                />
                                <input
                                    className="form-control"
                                    type="email"
                                    placeholder="Email"
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
                                <button className="btn btn-primary"  data-bs-dismiss="modal" aria-label="Close">Sign up</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default Register;