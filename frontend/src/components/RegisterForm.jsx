function RegisterForm({
    registerUsername,
    registerEmail,
    registerPassword,
    setRegisterUsername,
    setRegisterEmail,
    setRegisterPassword,
    onRegister,
    onSwitchToLogin
}) {
    return (
        <>
          <h2>Create account</h2>

          <form onSubmit={onRegister}>
            <div className="form-field">
              <label>Username</label>
              <input
                type="text"
                value={registerUsername}
                onChange={(event) => setRegisterUsername(event.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label>Email</label>
              <input
                type="email"
                value={registerEmail}
                onChange={(event) => setRegisterEmail(event.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label>Password</label>
              <input
                type="password"
                value={registerPassword}
                onChange={(event) => setRegisterPassword(event.target.value)}
                required
              />
            </div>

            <button type="submit">Create account</button>
          </form>

          <p className="auth-switch">
            Already have an account?{" "}
            <button type="button" onClick={onSwitchToLogin}>
              Log in
            </button>
          </p>        
        </>
    );
}

export default RegisterForm;