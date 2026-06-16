function LoginForm({
    email,
    password,
    setEmail,
    setPassword,
    onLogin,
    onSwitchToRegister
}) {
    return(
        <>
          <h2>Login</h2>
        
					<form onSubmit={onLogin}>
						<div className="form-field">
							<label>Email</label>
							<input 
								type="email"
								value={email}
								onChange={(event) => setEmail(event.target.value)}
								required
							/>
						</div>

						<div className="form-field">
							<label>Password</label>
							<input
								type="password"
								value={password}
								onChange={(event) => setPassword(event.target.value)}
								required
							/>
						</div>

						<button type="submit">Log in</button>
					</form>

					<p className="auth-switch">
						No account yet?{" "}
						<button type="button" onClick={onSwitchToRegister}>
							Create one
						</button>
					</p>
        </>
    );
}

export default LoginForm;