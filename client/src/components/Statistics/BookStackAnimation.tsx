import React from "react";
import { Image } from "react-bootstrap";
import Card from "react-bootstrap/Card";

const MAX_HEIGHT = 320;
const BUILDING_HEIGHT = 40;

interface BookStackAnimationProps {
  bookPileHeightMeters: number;
}

const BookStackAnimation: React.FC<BookStackAnimationProps> = ({
  bookPileHeightMeters: heightInMeters,
}) => {
  const bookPileHeightPercentage =
    heightInMeters > BUILDING_HEIGHT
      ? 100
      : (heightInMeters / BUILDING_HEIGHT) * 100;

  const buildingHeightPercentage =
    heightInMeters < BUILDING_HEIGHT
      ? 100
      : (BUILDING_HEIGHT / heightInMeters) * 100;

  return (
    <>
      <Card className="d-inline-block main-stat">
        <Card.Header>
          <h4>🏢 Book Stack</h4>
        </Card.Header>
        <Card.Body>
          <div className="d-flex flex-row">
            <div className="me-2">
              <Image
                src="img/Building.png"
                alt="Building"
                style={{
                  height: `${(buildingHeightPercentage / 100) * MAX_HEIGHT}px`,
                  marginTop: `${
                    MAX_HEIGHT -
                    (buildingHeightPercentage / 100) * MAX_HEIGHT +
                    15
                  }px`,
                }}
              />
            </div>
            <div>
              <Image
                src="img/BookPile.png"
                alt="BookPile"
                className="bookpile-animation"
                style={{
                  height: `${(bookPileHeightPercentage / 100) * MAX_HEIGHT}px`,
                  marginTop: `${
                    MAX_HEIGHT - (bookPileHeightPercentage / 100) * MAX_HEIGHT
                  }px`,
                }}
              />
            </div>
          </div>
        </Card.Body>

        <Card.Footer>
          If we pile up all the books you've read, <br /> it would be as tall as{" "}
          <b>{heightInMeters}</b> meters.
        </Card.Footer>
      </Card>
      <br />
    </>
  );
};

export default BookStackAnimation;
