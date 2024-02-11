import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import "../../pages/styles.css";
import { Wish } from "../../models/Wish";

interface Author {
  firstname: string;
  lastname: string;
}

interface CreateWishProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setResult: React.Dispatch<React.SetStateAction<number | null>>;
  setWishList: React.Dispatch<React.SetStateAction<Wish[]>>;
  wishList: Wish[];
}

const CreateWish: React.FC<CreateWishProps> = ({
  showModal,
  setShowModal,
  setResult,
  setWishList,
  wishList,
}) => {
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState<Author[]>([
    { firstname: "", lastname: "" },
  ]);
  const [editor, setEditor] = useState<string | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [details, setDetails] = useState<string | null>(null);

  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const values = [...authors];
    if (event.target.name === "firstname") {
      values[index].firstname = event.target.value;
    } else {
      values[index].lastname = event.target.value;
    }
    setAuthors(values);
  };

  const handleAddFields = () => {
    setAuthors([...authors, { firstname: "", lastname: "" }]);
  };

  const handleRemoveFields = (index: number) => {
    const values = [...authors];
    values.splice(index, 1);
    setAuthors(values);
  };

  const getFormattedAuthors = (): string => {
    let formattedAuthors = "";
    authors.forEach((author, index) => {
      formattedAuthors += `${
        author.firstname
      } ${author.lastname.toUpperCase()}`;
      if (index < authors.length - 1) formattedAuthors += ", ";
    });

    return formattedAuthors;
  };

  const submitWish = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      fetch("/api/v1/wishes/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          wish: {
            title,
            author: getFormattedAuthors(),
            editor,
            price,
            details,
          },
          userid: localStorage.getItem("userid"),
        }),
      }).then((response) => {
        fetch("/api/v1/wishes/get?userid=" + localStorage.getItem("userid"), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            setWishList(data);
            setResult(response.status);
            setShowModal(false);
            setAuthors([{ firstname: "", lastname: "" }]);
            setTitle("");
            setEditor(null);
            setPrice(null);
            setDetails(null);
          });
      });
    } catch (error) {
      setResult(500);
    }
  };

  return (
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Create Wish</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form
          className="form form-group"
          style={{ display: "flex", flexDirection: "column" }}
          onSubmit={submitWish}
        >
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="form-control"
            required
            placeholder="Title of the wished book"
          />
          {authors.map((author, index) => (
            <div key={`${author}-${index}`} className="col-md-12 author-form">
              <label className="mb-1 mt-2">{`Author ${
                index > 0 ? index + 1 : ""
              }`}</label>
              <div className="input-group mb-1">
                <input
                  type="text"
                  name="firstname"
                  value={author.firstname}
                  onChange={(event) => handleInputChange(index, event)}
                  className="form-control"
                  placeholder="Author Firstname"
                />
                <input
                  type="text"
                  name="lastname"
                  value={author.lastname}
                  onChange={(event) => handleInputChange(index, event)}
                  className="form-control"
                  required
                  placeholder="Author Lastname"
                />
                <button
                  className="btn btn-outline-primary"
                  type="button"
                  id="button-addon2"
                  onClick={() => handleAddFields()}
                >
                  ➕
                </button>
                {index !== 0 && (
                  <button
                    className="btn btn-outline-danger"
                    type="button"
                    id="button-addon2"
                    onClick={() => handleRemoveFields(index)}
                  >
                    ➖
                  </button>
                )}
              </div>
            </div>
          ))}
          <label className="mb-1 mt-2">Editor</label>
          <input
            type="text"
            value={editor ? editor : ""}
            onChange={(event) => setEditor(event.target.value)}
            className="form-control"
            placeholder="Editor of the book (optional)"
          />
          <label className="mb-1 mt-2">Price</label>
          <input
            type="number"
            min={0}
            value={price ? price : ""}
            onChange={(event) => setPrice(parseInt(event.target.value))}
            className="form-control"
            placeholder="Book's Price (optional)"
          />
          <label className="mb-1 mt-2">Details</label>
          <textarea
            value={details ? details : ""}
            onChange={(event) => setDetails(event.target.value)}
            className="form-control"
            placeholder="Wish Details (optional)"
          />

          <button className="btn btn-primary mt-3" type="submit">
            Create new wish
          </button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateWish;
