import { Component } from "react";
import Header from "../components/Header";
import Login from "./Login";
import { isConnected } from "../middlewares/auth";
import Loading from "../components/Loading";

interface HomeState {
  isUserConnected: boolean | null;
}

class Home extends Component<{}, HomeState> {
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
          <Loading />
        ) : this.state.isUserConnected ? (
          <div>
            <Header />
            <div className="container text-center mt-5">
              <h6 className="display-4">
                Welcome {localStorage.getItem("username")} ✨
              </h6>
            </div>
            <div className="container text-center mt-4">
              <div className="row justify-content-md-center">
                <div className="col col-lg-4">
                  <div className="card">
                    <img
                      src="bookshelf.jpg"
                      className="card-img-top"
                      alt="Bookshelf"
                    ></img>
                    <div className="card-body">
                      <h5 className="card-title">Consulter mes livres</h5>
                      <p className="card-text">
                        Consultez votre biliothèque avec tous vos livres,
                        filtrez là, retirez des livres !
                      </p>
                      <a href="/consulter" className="btn btn-info btn-lg ">
                        Consulter ma biliothèque
                      </a>
                    </div>
                  </div>
                </div>

                <div className="col col-lg-4">
                  <div className="card">
                    <img
                      src="bookshop.jpg"
                      className="card-img-top"
                      alt="Bookshop"
                    ></img>
                    <div className="card-body">
                      <h5 className="card-title">Ajouter des livres</h5>
                      <p className="card-text">
                        Ajouter des livres à votre biliothèque avec toutes les
                        informations que vous souhaitez
                      </p>
                      <a href="/ajouter" className="btn btn-info btn-lg">
                        Ajouter des livres à ma biliothèque
                      </a>
                    </div>
                  </div>
                </div>
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

export default Home;
