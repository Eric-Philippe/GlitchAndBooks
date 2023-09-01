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
import BooksPublicYear from "../components/Statistics/BooksPublicationYear";
import BooksGenres from "../components/Statistics/BooksGenres";
import BookMisc from "../components/Statistics/BookMisc";
import BookLanguages from "../components/Statistics/BookLanguage";
import BookTypes from "../components/Statistics/BookTypes";
import BookCountryOrigin from "../components/Statistics/BookCountryOrigin";

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
          this.userBooks.length > 0 ? (
            <div>
              <Header />
              <Container style={{ marginTop: "2rem" }} className="text-center">
                <Row>
                  <Col lg={3}>
                    <BookMisc books={this.userBooks} />
                    <br />
                    <BookPages books={this.userBooks} />
                    <br />
                    <BookWeight books={this.userBooks} />
                    <br />
                  </Col>
                  <Col>
                    <BookStackAnimation
                      bookPileHeightMeters={totalHeightInMeters}
                    />
                    <br />
                    <BookLanguages
                      books={this.userBooks}
                      resources={this.ressources}
                    />
                    <br />
                  </Col>
                  <Col>
                    <BooksPublicYear books={this.userBooks} />
                    <br />
                    <BooksGenres
                      books={this.userBooks}
                      resources={this.ressources}
                    />
                    <br />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <BookCountryOrigin
                      books={this.userBooks}
                      resources={this.ressources}
                    />
                  </Col>
                  <Col lg="auto">
                    <BookTypes
                      books={this.userBooks}
                      resources={this.ressources}
                    />
                    <br />
                  </Col>
                </Row>
              </Container>
            </div>
          ) : (
            <div>
              <Header />
              <div id="center-consulter">
                <div className="container text-center mt-5 mb-4">
                  <h6 className="display-6">Your bookshelf is empty :/</h6>
                </div>
                <div className="container text-center mt-5 mb-4">
                  <h6 className="display-6">
                    Add books to your bookshelf to see statistics !
                  </h6>
                </div>
              </div>
            </div>
          )
        ) : (
          <Login />
        )}
      </>
    );
  }
}

export default Stats;
