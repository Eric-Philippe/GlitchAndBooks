import { Component } from "react";

import DynamicTable from "../components/DynamicConsulter/DynamicTable/DynamicTable";
import Loading from "../components/Loading";
import Header from "../components/Header";
import Login from "./Login";

import {
  Columns,
  defaultColumns,
} from "../components/DynamicConsulter/utils/DefaultColumns";
import { isConnected } from "../middlewares/auth";
import Resources from "../middlewares/Resources";

import { Book } from "../models/Book";
import DynamicCards from "../components/DynamicConsulter/DynamicCards/DynamicCards";
import { bookFieldToText } from "../components/DynamicConsulter/utils/utils";

interface ConsulterState {
  isUserConnected: boolean | null;
  areResourcesLoaded: boolean | null;
  isUserDataFetched: boolean | null;
}

class Consulter extends Component<{}, ConsulterState> {
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

  private async fetchUserData(): Promise<Book[]> {
    let books: Book[] = [];
    try {
      const res = await fetch(
        "/api/v1/books/get?userid=" + localStorage.getItem("userid"),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (res.status === 200) {
        books = await res.json();
        return books;
      } else {
        return books;
      }
    } catch (e) {
      return books;
    }
  }

  async componentDidMount() {
    try {
      const connected = (await isConnected()) as boolean;
      if (!this.ressources.isReady()) await this.ressources.fill();
      this.userBooks = await this.fetchUserData();

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
                <h6 className="display-6">Consulter vos livres ✨</h6>
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

export default Consulter;
