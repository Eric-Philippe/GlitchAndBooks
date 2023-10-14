import { Component } from "react";
import Loading from "../components/Loading";

interface ResetPasswordProps {
  isPageReady: boolean;
  token: string | null;
  newPassword: string | null;
  confirmPassword: string | null;
  successMsg: string | null;
  errorMsg: string | null;
}

interface User {
  username: string;
  userid: string;
  email: string;
}

class ResetPassword extends Component<{}, ResetPasswordProps> {
  private user: User | null = null;
  private token: string | null = null;

  constructor(props: {}) {
    super(props);
    this.state = {
      isPageReady: false,
      token: null,
      newPassword: null,
      confirmPassword: null,
      successMsg: null,
      errorMsg: null,
    };
  }

  async componentDidMount() {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");

    if (token === null) return (window.location.href = "/");

    try {
      const res = await fetch("/api/v1/account/password/isvalidtoken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (res.status !== 200) return (window.location.href = "/");

      const response = await res.json();
      this.token = token;
      this.user = response.user as User;
      this.setState({ isPageReady: true });
    } catch (err) {
      window.location.href = "/";
    }
  }

  // Méthode pour gérer la soumission du formulaire
  onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Vérification si les champs ne sont pas vides
    if (!this.state.newPassword || !this.state.confirmPassword) {
      this.setState({ errorMsg: "Please fill in all fields." });
      return;
    }

    // Vérification si les deux mots de passe sont identiques
    if (this.state.newPassword !== this.state.confirmPassword) {
      this.setState({ errorMsg: "Passwords do not match." });
      return;
    }

    const res = await fetch("/api/v1/account/password/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: this.token,
        newPassword: this.state.newPassword,
      }),
    });

    const response = await res.json();

    if (res.status === 200) {
      this.setState({ errorMsg: null });
      this.setState({
        successMsg:
          "Reset password successful, you will be redirected to the login page in a few seconds.",
      });

      setTimeout(() => {
        window.location.href = "/";
      }, 4500);
      return;
    } else {
      this.setState({ successMsg: null });
      this.setState({ errorMsg: response.message });
    }

    this.setState({ errorMsg: response.message });
  };

  render() {
    return (
      <>
        {!this.state.isPageReady ? (
          <Loading />
        ) : (
          <div className="login-container d-flex justify-content-center align-items-center vh-100">
            <div className="login-form col-md-4">
              <div
                id="success-msg"
                className={
                  this.state.successMsg
                    ? "alert alert-success"
                    : "alert alert-success d-none"
                }
              >
                {this.state.successMsg && <p>{this.state.successMsg}</p>}
              </div>
              <div
                id="error-msg"
                className={
                  this.state.errorMsg ? "alert alert-danger" : "d-none"
                }
              >
                {this.state.errorMsg && <p>{this.state.errorMsg}</p>}
              </div>
              <h2 className="mb-4">
                Reset password for <b>{this.user?.username}</b>
              </h2>
              <form onSubmit={this.onSubmit}>
                <div className="form-group mb-3">
                  <label htmlFor="password">New password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="New password"
                    onChange={(e) => {
                      this.setState({ newPassword: e.target.value });
                    }}
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="password">Confirm new password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmpassword"
                    placeholder="Confirm new password"
                    onChange={(e) => {
                      this.setState({ confirmPassword: e.target.value });
                    }}
                  />
                </div>
                <button className="btn btn-primary">Reset password</button>
              </form>
            </div>
          </div>
        )}
      </>
    );
  }
}

export default ResetPassword;
