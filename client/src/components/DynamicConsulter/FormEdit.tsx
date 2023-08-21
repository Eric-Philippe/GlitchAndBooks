import React, { useState } from "react";

import "bootstrap";
import { Book } from "../../models/Book";
import Resources from "../../middlewares/Resources";
import { bookEquals } from "../../utils/BooksUtils";
import Modal from "react-bootstrap/esm/Modal";
import { Button, FloatingLabel, Form, InputGroup, Row } from "react-bootstrap";

const NUMBER_EMOTES = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];

interface EditBookProps {
  book: Book;
  ressources: Resources;
  handeCloseParent: () => void;
}

const FormEdit: React.FC<EditBookProps> = ({
  book,
  ressources,
  handeCloseParent,
}) => {
  const originBook = book;
  const [editedBook, setEditedBook] = useState<Book>(book);

  const [validated, setValidated] = useState(false);

  const editBook = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      console.log("Original Book Name: " + originBook.title);

      console.log(bookEquals(originBook, editedBook));
      console.log(originBook.bookId);
    }

    setValidated(true);
  };

  return (
    <Form
      noValidate
      validated={validated}
      onSubmit={(e) => {
        editBook(e);
      }}
    >
      <Row className="mb-3">
        <Form.Group>
          <InputGroup>
            <InputGroup.Text id="title-label">📗</InputGroup.Text>
            <Form.Control
              placeholder="Title"
              aria-label="Title"
              value={editedBook.title}
              required
              onChange={(e) => {
                setEditedBook({ ...editedBook, title: e.target.value });
              }}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a title.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
      </Row>

      {book.lastname.map((lastname, index) => (
        <Row
          className={index === book.lastname.length - 1 ? "mb-3" : "mb-2"}
          key={index}
        >
          <Form.Group>
            <InputGroup>
              <InputGroup.Text>{NUMBER_EMOTES[index]}</InputGroup.Text>
              <Form.Control
                type="text"
                id={"lastname-" + index}
                placeholder="Last name"
                aria-label="Lastname"
                aria-describedby="basic-addon1"
                value={editedBook.lastname[index]}
                required
                onChange={(e) => {
                  const newLastname = [...editedBook.lastname];
                  newLastname[index] = e.target.value;
                  setEditedBook({ ...editedBook, lastname: newLastname });
                }}
              />
              <Form.Control
                type="text"
                id={"firstname-" + index}
                placeholder="Firstname"
                aria-label="Firstname"
                aria-describedby="firstname-input"
                value={editedBook.firstname[index]}
                onChange={(e) => {
                  const newFirstname = [...editedBook.firstname];
                  newFirstname[index] = e.target.value;
                  setEditedBook({ ...editedBook, firstname: newFirstname });
                }}
              />
              <Form.Control.Feedback type="invalid">
                Please provide at least an author's last name.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Row>
      ))}

      {/** Language Select */}
      <Row className="mb-3">
        <Form.Group>
          <InputGroup>
            <InputGroup.Text>🌐</InputGroup.Text>
            <FloatingLabel controlId="floatingSelect" label="Language">
              <Form.Select
                value={editedBook.lang}
                required
                onChange={(e) => {
                  setEditedBook({ ...editedBook, lang: e.target.value });
                }}
              >
                {ressources.getLanguages().map((lang) => {
                  return (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  );
                })}
              </Form.Select>
            </FloatingLabel>
          </InputGroup>
        </Form.Group>
      </Row>

      {/** Pages */}
      <InputGroup className="mb-3">
        <InputGroup.Text>📄</InputGroup.Text>
        <FloatingLabel controlId="floatingPagesLabel" label="Pages">
          <Form.Control
            type="number"
            placeholder="Pages"
            aria-label="Pages"
            aria-describedby="basic-addon1"
            value={editedBook.pages || ""}
            onChange={(e) => {
              setEditedBook({
                ...editedBook,
                pages: parseInt(e.target.value),
              });
            }}
          />
        </FloatingLabel>
      </InputGroup>

      {/** Publication Year */}
      <InputGroup className="mb-3">
        <InputGroup.Text>📅</InputGroup.Text>
        <FloatingLabel label="Publication Year">
          <Form.Control
            type="number"
            id="publicationYear"
            placeholder="Publication Year"
            aria-label="Publication Year"
            aria-describedby="basic-addon1"
            value={editedBook.publicationYear || ""}
            onChange={(e) => {
              setEditedBook({
                ...editedBook,
                publicationYear: parseInt(e.target.value),
              });
            }}
          />
        </FloatingLabel>
      </InputGroup>

      {/** Height */}
      <InputGroup className="mb-2">
        <InputGroup.Text>Height 📏</InputGroup.Text>
        <Form.Control
          type="number"
          id="height"
          placeholder="Height"
          aria-label="Height"
          aria-describedby="basic-addon1"
          value={editedBook.height || ""}
          onChange={(e) => {
            setEditedBook({
              ...editedBook,
              height: parseInt(e.target.value),
            });
          }}
        />
        <InputGroup.Text>cm</InputGroup.Text>
      </InputGroup>

      {/** Width */}
      <InputGroup className="mb-3">
        <InputGroup.Text>Width 📏</InputGroup.Text>
        <Form.Control
          type="number"
          className="form-control"
          id="width"
          placeholder="Width"
          aria-label="Width"
          aria-describedby="basic-addon1"
          value={editedBook.width || ""}
          onChange={(e) => {
            setEditedBook({
              ...editedBook,
              width: parseInt(e.target.value),
            });
          }}
        />
        <InputGroup.Text>cm</InputGroup.Text>
      </InputGroup>

      {/** Country of Origin */}
      <InputGroup className="mb-3">
        <InputGroup.Text>🗺️</InputGroup.Text>
        <FloatingLabel controlId="floatingSelect" label="Country of Origin">
          <Form.Select
            aria-label="Country of Origin"
            id="countryOfOrigin"
            required
            defaultValue={editedBook.originCountry}
            onChange={(e) => {
              setEditedBook({ ...editedBook, originCountry: e.target.value });
            }}
          >
            {ressources.getCountries().map((country) => {
              return (
                <option key={country} value={country}>
                  {country}
                </option>
              );
            })}
          </Form.Select>
        </FloatingLabel>
      </InputGroup>

      {/** Type */}
      <InputGroup className="mb-3">
        <InputGroup.Text>🔖</InputGroup.Text>
        <FloatingLabel controlId="floatingSelect" label="Type">
          <Form.Select
            className="form-select"
            aria-label="Country of Origin"
            id="type"
            required
            defaultValue={editedBook.type}
            onChange={(e) => {
              setEditedBook({ ...editedBook, type: e.target.value });
            }}
          >
            {ressources.getTypes().map((type) => {
              return (
                <option key={type} value={type}>
                  {type}
                </option>
              );
            })}
          </Form.Select>
        </FloatingLabel>
      </InputGroup>

      {/** Genres */}
      <InputGroup className="mb-3">
        <InputGroup.Text>📚</InputGroup.Text>
        <Form.Select
          aria-label="Country of Origin"
          multiple
          defaultValue={editedBook.genres || []}
          onChange={(e) => {
            const genres = Array.from(
              e.target.selectedOptions,
              (option) => option.value
            );
            setEditedBook({ ...editedBook, genres: genres });
          }}
        >
          {ressources.getGenres().map((genre) => {
            return (
              <option key={genre} value={genre}>
                {genre}
              </option>
            );
          })}
        </Form.Select>
      </InputGroup>

      {/** Notes */}
      <Form.Group className="mb-3">
        <Form.Label>Notes</Form.Label>
        <Form.Control
          as="textarea"
          aria-label="With textarea"
          id="notes"
          rows={3}
          value={editedBook.notes || ""}
          onChange={(e) => {
            setEditedBook({ ...editedBook, notes: e.target.value });
          }}
        />
      </Form.Group>

      <Form.Check
        type="switch"
        id="physical"
        label="Physical"
        defaultChecked={editedBook.physical}
        onChange={(e) => {
          setEditedBook({ ...editedBook, physical: e.target.checked });
        }}
      ></Form.Check>

      <Form.Check
        type="switch"
        id="read"
        label="Read"
        defaultChecked={editedBook.read}
        onChange={(e) => {
          setEditedBook({ ...editedBook, read: e.target.checked });
        }}
      ></Form.Check>

      <Form.Check
        type="switch"
        id="wantRead"
        label="Want to Read"
        className="mb-3"
        defaultChecked={editedBook.wantRead}
        onChange={(e) => {
          setEditedBook({ ...editedBook, wantRead: e.target.checked });
        }}
      ></Form.Check>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            handeCloseParent();
          }}
        >
          Close
        </Button>

        <Button variant="danger">Delete Book</Button>
        <Button type="submit" variant="primary">
          Save changes
        </Button>
      </Modal.Footer>
    </Form>
  );
};

export default FormEdit;
