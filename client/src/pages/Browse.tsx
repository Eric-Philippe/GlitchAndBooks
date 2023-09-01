import { Component } from "react";

import DynamicTable from "../components/Browse/DynamicTable/DynamicTable";
import Loading from "../components/Loading";
import Header from "../components/Header";
import Login from "./Login";

import {
  Columns,
  defaultColumns,
} from "../components/Browse/utils/DefaultColumns";
import { isConnected } from "../middlewares/auth";
import Resources from "../middlewares/Resources";

import { Book } from "../models/Book";
import DynamicCards from "../components/Browse/DynamicCards/DynamicCards";
import { bookFieldToText } from "../components/Browse/utils/utils";
import { fetchUserData } from "../utils/BooksUtils";

interface ConsulterState {
  isUserConnected: boolean | null;
  areResourcesLoaded: boolean | null;
  isUserDataFetched: boolean | null;
}

class Browse extends Component<{}, ConsulterState> {
  private ressources: Resources = Resources.getInstance();
  private userBooks: Book[] = [];

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
      if (!this.ressources.isReady()) await this.ressources.fill();
      this.userBooks = await fetchUserData();

      this.setState({ isUserDataFetched: true });
      this.setState({ areResourcesLoaded: true });
      this.setState({ isUserConnected: connected });
    } catch (error) {
      console.error("Error checking connection status:", error);
    }
  }

  render() {
    let userOnSmallerScreen = window.innerWidth < 1024;

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
                <h6 className="display-6">Browse your books ✨</h6>
              </div>
              <div className="">
                {userOnSmallerScreen ? (
                  <div>
                    <DynamicCards
                      allColumns={Columns}
                      data={this.userBooks}
                      initColumns={defaultColumns}
                      fieldToValue={bookFieldToText}
                      ressources={this.ressources}
                    />
                  </div>
                ) : (
                  <div>
                    <DynamicTable
                      allColumns={Columns}
                      data={this.userBooks}
                      initColumns={defaultColumns}
                      fieldToValue={bookFieldToText}
                      ressources={this.ressources}
                    />
                  </div>
                )}
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

export default Browse;
