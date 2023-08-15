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
    const testData = [
      { id: 1, name: "John", age: 20 },
      { id: 2, name: "Jane", age: 24 },
      { id: 3, name: "Susan", age: 16 },
      { id: 4, name: "Chris", age: 55 },
      { id: 5, name: "Dan", age: 40 },
      { id: 6, name: "John", age: 20 },
    ];
    return (
      <>
        {this.state.isUserConnected === null ? (
          <p>Loading...</p>
        ) : this.state.isUserConnected ? (
          <div>
            <Header />
            <div className="container text-center mt-5 mb-4">
              <h6 className="display-6">Consulter vos livres ✨</h6>
            </div>

            <div className="d-flex justify-content-center align-items-center mb-4">
              <div
                className="btn-group"
                role="group"
                aria-label="Basic outlined example"
              >
                <button type="button" className="btn btn-outline-primary">
                  Filtres
                </button>
                <button type="button" className="btn btn-outline-primary">
                  Colonnes
                </button>
                <button type="button" className="btn btn-outline-primary">
                  Reset
                </button>
              </div>
            </div>
            <div className="table-responsive">
              <div className="table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Age</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testData.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.age}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
