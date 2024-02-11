import { Component, ReactNode } from "react";
import { isConnected } from "../middlewares/auth";
import { fetchUserData } from "../utils/WishUtils";
import Header from "../components/Header";
import Loading from "../components/Loading";
import Login from "./Login";
import CardView from "../components/Wishlist/CardView";
import TableView from "../components/Wishlist/TableView";
import { Wish } from "../models/Wish";

interface ConsulterState {
  isUserConnected: boolean | null;
  areResourcesLoaded: boolean | null;
  isUserDataFetched: boolean | null;
}

class WishList extends Component<{}, ConsulterState> {
  private userWishes: Wish[] = [];

  constructor(props: {}) {
    super(props);
    this.state = {
      isUserConnected: null,
      areResourcesLoaded: null,
      isUserDataFetched: false,
    };
  }

  async componentDidMount() {
    try {
      const connected = (await isConnected()) as boolean;
      this.userWishes = await fetchUserData();

      this.setState({ isUserDataFetched: true });
      this.setState({ areResourcesLoaded: true });
      this.setState({ isUserConnected: connected });
    } catch (error) {
      console.error("Error checking connection status:", error);
    }
  }

  render(): ReactNode {
    const userOnSmallerScreen = window.innerWidth < 1024;

    return (
      <>
        {this.state.isUserConnected === null ? (
          <div>
            <Header />
            <Loading />
          </div>
        ) : this.state.isUserConnected ? (
          <div>
            <Header />
            <div id="center-consulter">
              <div className="container text-center mt-5 mb-4">
                <h6 className="display-6">Browse your wishlist ✨</h6>
              </div>
              <div>
                <div>
                  <div>
                    {userOnSmallerScreen ? (
                      <CardView data={this.userWishes} />
                    ) : (
                      <TableView data={this.userWishes} />
                    )}
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

export default WishList;
