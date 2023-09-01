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
                      <h5 className="card-title">Browse bookshelf</h5>
                      <p className="card-text">
                        Browse the contents of your bookshelf, filter, sort,
                        edit, and delete books
                      </p>
                      <a href="/browse" className="btn btn-info btn-l ">
                        Browse my bookshelf
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
                      <h5 className="card-title">Add Book to bookshelf</h5>
                      <p className="card-text">
                        Add books to your bookshelf with all the information you
                        want and need
                      </p>
                      <a href="/add" className="btn btn-info btn-l">
                        Add a book to my bookshelf
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
