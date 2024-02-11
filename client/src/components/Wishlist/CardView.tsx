import React, { useState } from "react";
import { Wish } from "../../models/Wish";
import {
  Button,
  ButtonGroup,
  Container,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import CreateWish from "./CreateWish";
import { getAuthors } from "../../utils/WishUtils";

interface CardViewProps {
  data: Wish[];
}

const CardView: React.FC<CardViewProps> = ({ data }) => {
  const [userWishes, setUserWishes] = useState<Wish[]>(data);
  const [showModal, setShowModal] = useState(false);
  const [createResultNum, setCreateResultNum] = useState<number | null>(null);
  const [deleteResultNum, setDeleteResultNum] = useState<number | null>(null);

  const getDetailsText = (details: string | null) => {
    if (!details) return "N/A";
    if (details.length > 50) return details.slice(0, 50) + "...";
    return details;
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
          fetch("/api/v1/wishes/get?userid=" + localStorage.getItem("userid"), {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          })
            .then((res) => res.json())
            .then((data) => {
              setUserWishes(data);
            })
            .catch((error) => {
              setDeleteResultNum(500);
            });
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
          <Row>
            {userWishes.map((wish) => (
              <Col sm={12} md={6} lg={4} key={wish.title}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title>{wish.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {wish.author}
                    </Card.Subtitle>
                    <Card.Text>
                      Price: {wish.price ? `${wish.price}€` : "N/A"}
                      <br />
                      Editor: {wish.editor ? wish.editor : "N/A"}
                      <br />
                      Details:{" "}
                      {wish.details ? getDetailsText(wish.details) : "N/A"}
                      <br />
                      Creation: {wish.date}
                    </Card.Text>
                    <ButtonGroup>
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => {
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
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deleteWish(wish.wishlistid)}
                      >
                        Remove
                      </Button>
                    </ButtonGroup>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
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

export default CardView;
