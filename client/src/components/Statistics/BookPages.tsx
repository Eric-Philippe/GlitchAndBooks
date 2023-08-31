import React from "react";
import Card from "react-bootstrap/Card";
import { Book } from "../../models/Book";

interface BookPagesProps {
  books: Book[];
}

const hugePagesToReadable = (pages: number) => {
  // Put dots every 3 digits
  let pagesString = pages.toString();
  for (let i = pagesString.length - 3; i > 0; i -= 3) {
    pagesString = pagesString.slice(0, i) + "." + pagesString.slice(i);
  }

  return pagesString;
};

const BookPages: React.FC<BookPagesProps> = ({ books }) => {
  const totalPages = books.reduce((acc, book) => acc + (book.pages || 0), 0);
  const totalPagesToRead = books.reduce(
    (acc, book) => acc + (book.read ? 0 : book.pages || 0),
    0
  );

  const bookWithMostPages = books.reduce((acc, book) => {
    return book.pages && book.pages > (acc.pages || 0) ? book : acc;
  });

  return (
    <Card className="d-inline-block sub-stat">
      <Card.Header>
        <h4>📖 Book Pages</h4>
      </Card.Header>
      <Card.Body>
        You have exactly <b>{hugePagesToReadable(totalPages)}</b> pages in your
        library !
        <br />
        You have <b>{hugePagesToReadable(totalPagesToRead)}</b> pages to read !
        <br />
        It means that you've read{" "}
        <b>{hugePagesToReadable(totalPages - totalPagesToRead)}</b> pages
      </Card.Body>

      <Card.Footer>
        The book with the most pages in your library is{" "}
        <b>{bookWithMostPages.title}</b> with{" "}
        <b>{hugePagesToReadable(bookWithMostPages.pages || 0)}</b> pages
      </Card.Footer>
    </Card>
  );
};

export default BookPages;
