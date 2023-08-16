import { Component } from "react";

import Login from "./Login";
import Header from "../components/Header";
import Loading from "../components/Loading";

import { isConnected } from "../middlewares/auth";
import Ressources from "../middlewares/Resources";

interface HomeState {
  isUserConnected: boolean | null;
  areRessourcesLoaded: boolean | null;
}

class Home extends Component<{}, HomeState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      isUserConnected: null,
      areRessourcesLoaded: null,
    };
  }

  async componentDidMount() {
    try {
      const connected = (await isConnected()) as boolean;
      const areRessourcesLoaded = await (
        await Ressources.getInstance()
      ).isReady();
      this.setState({ isUserConnected: connected });
      this.setState({ areRessourcesLoaded: areRessourcesLoaded });
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
              <h6 className="display-5">
                ✨ Welcome {localStorage.getItem("username")} !{" "}
              </h6>
              <h6 className="display-6">
                Enjoy your books in ​
                <img src="logos/G&B_dark.png" alt="logo" width="150px"></img>
              </h6>
            </div>
            <div className="container text-center mt-4 mb-5">
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
                      <a href="/consulter" className="btn btn-info btn-l ">
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
                      <a href="/ajouter" className="btn btn-info btn-l">
                        Remplir ma biliothèque
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
