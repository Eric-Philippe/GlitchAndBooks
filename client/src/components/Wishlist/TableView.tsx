import React, { useState } from "react";
import { Wish } from "../../models/Wish";

import {
  Button,
  ButtonGroup,
  Container,
  Table as BootstrapTable,
} from "react-bootstrap";
import CreateWish from "./CreateWish";
import { getAuthors } from "../../utils/WishUtils";

interface TableViewProps {
  data: Wish[];
}

const TableView: React.FC<TableViewProps> = ({ data }) => {
  const [userWishes, setUserWishes] = useState<Wish[]>(data);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [createResultNum, setCreateResultNum] = useState<number | null>(null);
  const [deleteResultNum, setDeleteResultNum] = useState<number | null>(null);

  const getDetailsText = (details: string | null) => {
    if (!details) return "N/A";
    if (details.length > 50) return details.slice(0, 50) + "...";
    return details;
  };

  const sortWishes = (column: keyof Wish) => {
    const newDirection =
      sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
    const sortedWishes = [...userWishes].sort((a, b) => {
      if (a[column] != null && b[column] != null) {
        //@ts-ignore
        if (a[column] < b[column]) {
          return newDirection === "asc" ? -1 : 1;
        }
        //@ts-ignore
        if (a[column] > b[column]) {
          return newDirection === "asc" ? 1 : -1;
        }
      }
      return 0;
    });

    setUserWishes(sortedWishes);
    setSortColumn(column);
    setSortDirection(newDirection);
  };

  const deleteWish = (wishId: number) => {
    fetch("/api/v1/wishes/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ wishId: wishId }),
    })
      .then((res) => {
        if (res.status === 200) {
          setDeleteResultNum(200);
          setUserWishes(
            userWishes.filter((wish) => wish.wishlistid !== wishId)
          );
        } else {
          setDeleteResultNum(500);
        }
      })
      .catch((error) => {
        setDeleteResultNum(500);
      });
  };

  return (
    <>
      <Container>
        <CreateWish
          showModal={showModal}
          setShowModal={setShowModal}
          setResult={setCreateResultNum}
          setWishList={setUserWishes}
          wishList={userWishes}
        />
        <Button
          variant="primary"
          size="sm"
          className="mb-3 mx-auto d-block"
          onClick={() => setShowModal(true)}
        >
          Create a wish
        </Button>
      </Container>

      {userWishes.length > 0 ? (
        <Container>
          {createResultNum === 201 ? (
            <div className="alert alert-success" role="alert">
              Action completed successfully
              <button
                onClick={() => setCreateResultNum(null)}
                style={{ float: "right" }}
                className="btn-close"
              ></button>
            </div>
          ) : createResultNum === 500 ? (
            <div className="alert alert-danger" role="alert">
              An error occured while processing your request
              <button
                onClick={() => setCreateResultNum(null)}
                style={{ float: "right" }}
                className="btn-close"
              ></button>
            </div>
          ) : createResultNum === 409 ? (
            <div className="alert alert-warning" role="alert">
              Wish already exists
              <button
                onClick={() => setCreateResultNum(null)}
                style={{ float: "right" }}
                className="btn-close"
              ></button>
            </div>
          ) : null}

          {deleteResultNum === 200 ? (
            <div className="alert alert-success" role="alert">
              Delete action completed successfully
              <button
                onClick={() => setDeleteResultNum(null)}
                style={{ float: "right" }}
                className="btn-close"
              ></button>
            </div>
          ) : deleteResultNum === 500 ? (
            <div className="alert alert-danger" role="alert">
              An error occurred while deleting
              <button
                onClick={() => setDeleteResultNum(null)}
                style={{ float: "right" }}
                className="btn-close"
              ></button>
            </div>
          ) : null}
          <BootstrapTable className="table table-striped table-hover caption-top">
            <caption>Your wishlist</caption>

            <thead>
              <tr>
                <th scope="col" onClick={() => sortWishes("date")}>
                  Creation{" "}
                  {sortColumn === "date" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th scope="col" onClick={() => sortWishes("title")}>
                  Title{" "}
                  {sortColumn === "title" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th scope="col" onClick={() => sortWishes("author")}>
                  Author{" "}
                  {sortColumn === "author" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th scope="col" onClick={() => sortWishes("price")}>
                  Price{" "}
                  {sortColumn === "price" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th scope="col" onClick={() => sortWishes("editor")}>
                  Editor{" "}
                  {sortColumn === "editor" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th scope="col" onClick={() => sortWishes("details")}>
                  Details{" "}
                  {sortColumn === "details" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {userWishes.map((wish) => (
                <tr key={wish.title}>
                  <td>{wish.date}</td>
                  <td>{wish.title}</td>
                  <td>{wish.author}</td>
                  <td>{wish.price ? `${wish.price}€` : "N/A"}</td>
                  <td>{wish.editor ? wish.editor : "N/A"}</td>
                  <td>{wish.details ? getDetailsText(wish.details) : "N/A"}</td>
                  <td>
                    <ButtonGroup>
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => {
                          /**
                           * Go to : /add?title=${wish.title}&author=${wish.author}&author=${wish.author}
                           */
                          let authors: {
                            firstname: string;
                            lastname: string;
                          }[] = getAuthors(wish.author);
                          let href = `/add?id=${wish.wishlistid}&title=${wish.title}&author=${authors[0].firstname}&author=${authors[0].lastname}`;
                          if (authors.length > 1) {
                            for (let i = 1; i < authors.length; i++) {
                              href += `&author=${authors[i].firstname}&author=${authors[i].lastname}`;
                            }
                          }

                          window.location.href = href;
                        }}
                      >
                        Add Book
                      </Button>
                      <div></div>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deleteWish(wish.wishlistid)}
                      >
                        Remove
                      </Button>
                    </ButtonGroup>
                  </td>
                </tr>
              ))}
            </tbody>
          </BootstrapTable>
        </Container>
      ) : (
        <div>
          <div className="container text-center mt-5 mb-4">
            <p className="lead">
              You don't have any books in your wishlist yet. <br />
              Click on the "Add" button to add a book to your wishlist.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default TableView;
