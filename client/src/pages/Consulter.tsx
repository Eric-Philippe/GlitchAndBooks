import { Component } from "react";
import Header from "../components/Header";
import Login from "./Login";
import { isConnected } from "../middlewares/auth";

interface HomeState {
  isUserConnected: boolean | null;
}

class Consulter extends Component<{}, HomeState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      isUserConnected: null,
    };
  }

  async componentDidMount() {
    try {
      const connected = (await isConnected()) as boolean;
      this.setState({ isUserConnected: connected });
    } catch (error) {
      console.error("Error checking connection status:", error);
    }
  }

  render() {
    return (
      <>
        {this.state.isUserConnected === null ? (
          <p>Loading...</p>
        ) : this.state.isUserConnected ? (
          <div>
            <Header />
            <div className="container text-center mt-5">
              <h6 className="display-6">Consulter vos livres ✨</h6>
            </div>
          </div>
        ) : (
          <Login />
        )}
      </>
    );
  }
}

export default Consulter;
