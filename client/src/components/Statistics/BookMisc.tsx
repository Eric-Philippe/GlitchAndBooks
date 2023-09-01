import React from "react";
import Card from "react-bootstrap/Card";
import { Book } from "../../models/Book";

interface BookPagesProps {
  books: Book[];
}

const BookMisc: React.FC<BookPagesProps> = ({ books }) => {
  const totalBooks = books.length;
  const totalEBook = books.filter((book) => !book.physical).length;
  const totalBookToRead = books.filter((book) => !book.read).length;
  const randomBook = books[Math.floor(Math.random() * books.length)];

  return (
    <>
      <Card className="d-inline-block sub-stat">
        <Card.Header>
          <h4>📕 Miscellaneous Books</h4>
        </Card.Header>
        <Card.Body>
          You have exactly <b>{totalBooks}</b> books in your bookshelf
          <br />
          {totalEBook > 1 ? (
            <>
              <b>{totalEBook}</b> of them are e-books
              <br />
            </>
          ) : (
            ""
          )}
          {totalBookToRead > 1 ? (
            <>
              <b>{totalBookToRead}</b> of them are yet to be read
              <br />
            </>
          ) : (
            ""
          )}
          <br />
          Here is a random book from your library: <b>{randomBook.title}</b>
        </Card.Body>

        <Card.Footer></Card.Footer>
      </Card>
      <br />
    </>
  );
};

export default BookMisc;
