import React from "react";
import Card from "react-bootstrap/Card";
import { Book } from "../../models/Book";

const PAPER_GRAMMAGE = 100; // g/m²
const COUVERTURE_GRAMMAGE = 300; // g/m²

const getBookWeight = (book: Book) => {
  const height = book.height || 0; // in cm
  const width = book.width || 0; // in cm
  const pages = book.pages || 0;

  // Calcul du poids des pages
  const pageWeight = (height * width * PAPER_GRAMMAGE) / 10000; // Convertir de cm² à m² en divisant par 10 000

  // Calcul du poids de la couverture
  const coverWeight = (height * width * COUVERTURE_GRAMMAGE) / 10000; // Convertir de cm² à m² en divisant par 10 000

  // Calcul du poids total du livre
  const totalWeight = pageWeight * pages + coverWeight * 2; // Ajouter le poids des pages et deux fois le poids de la couverture

  return totalWeight; // Le poids total est en grammes
};

interface BookWeightProps {
  books: Book[];
}

const BookWeight: React.FC<BookWeightProps> = ({ books }) => {
  const totalWeight = books.reduce((acc, book) => acc + getBookWeight(book), 0);
  const heavierBook = books.reduce(
    (acc, book) => {
      const bookWeight = getBookWeight(book);
      return bookWeight > acc.weight ? { book, weight: bookWeight } : acc;
    },
    { book: books[0], weight: getBookWeight(books[0]) }
  );

  return (
    <>
      <Card className="d-inline-block sub-stat">
        <Card.Header>
          <h4>🐘 Book Weight</h4>
        </Card.Header>
        <Card.Body>
          The total weight of your books is{" "}
          <b>{Math.round((totalWeight / 1000) * 100) / 100}</b> kilograms
          <br /> It makes a book an average weight of{" "}
          <b>{Math.round((totalWeight / books.length / 1000) * 100)} grams</b>
          <br />
          The heaviest book is <b>{heavierBook.book.title}</b> with{" "}
          <b>{Math.round((heavierBook.weight / 1000) * 100)} grams</b>
        </Card.Body>

        <Card.Footer>
          <i>
            Based on the average weight of a page <b>({PAPER_GRAMMAGE} g/m²)</b>{" "}
            and the average weight of a cover <b>({COUVERTURE_GRAMMAGE}</b>{" "}
            g/m²)
          </i>
        </Card.Footer>
      </Card>
      <br />
    </>
  );
};

export default BookWeight;
