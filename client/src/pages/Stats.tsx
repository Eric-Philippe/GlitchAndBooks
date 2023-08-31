import { Component } from "react";

import Loading from "../components/Loading";
import Header from "../components/Header";
import Login from "./Login";

import { isConnected } from "../middlewares/auth";
import Resources from "../middlewares/Resources";

import { Book } from "../models/Book";
import { fetchUserData } from "../utils/BooksUtils";
import BookStackAnimation from "../components/Statistics/BookStackAnimation";
import { Col, Container, Row } from "react-bootstrap";
import BookWeight from "../components/Statistics/BookWeight";
import BookPages from "../components/Statistics/BookPages";

interface ConsulterState {
  isUserConnected: boolean | null;
  areResourcesLoaded: boolean | null;
  isUserDataFetched: boolean | null;
}

class Stats extends Component<{}, ConsulterState> {
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
    const totalHeight = this.userBooks.reduce(
        (acc, book) => acc + (book.height ? book.height : 0),
        0
      ),
      totalHeightInMeters = totalHeight / 100;

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
            <Container style={{ marginTop: "2rem" }}>
              <Row className="justify-content-md-center">
                <Col md="auto">
                  <BookStackAnimation
                    bookPileHeightMeters={totalHeightInMeters}
                  />
                  <br />
                </Col>
                <Col>
                  <BookWeight books={this.userBooks} />
                  <br />
                  <BookPages books={this.userBooks} />
                </Col>
              </Row>
            </Container>
          </div>
        ) : (
          <Login />
        )}
      </>
    );
  }
}

export default Stats;
