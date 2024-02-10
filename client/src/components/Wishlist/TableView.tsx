import { Wish } from "../../models/Wish";

import {
  Button,
  ButtonGroup,
  Container,
  Table as BootstrapTable,
  FloatingLabel,
  FormControl,
  InputGroup,
  Modal,
  ToastContainer,
  OverlayTrigger,
  Tooltip,
  Form,
} from "react-bootstrap";

interface TableViewProps {
  data: Wish[];
}

const TableView: React.FC<TableViewProps> = ({ data }) => {
  return (
    <Container>
      <BootstrapTable className="table table-striped table-hover caption-top">
        <caption>Your wishlist</caption>
        <thead>
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Author</th>
            <th scope="col">Price</th>
            <th scope="col">Editor</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((wish) => (
            <tr key={wish.title}>
              <td>{wish.title}</td>
              <td>{wish.author}</td>
              <td>{wish.price}</td>
              <td>{wish.editor}</td>
              <td>
                <ButtonGroup>
                  <Button variant="danger" size="sm">
                    Remove
                  </Button>
                </ButtonGroup>
              </td>
            </tr>
          ))}
        </tbody>
      </BootstrapTable>
    </Container>
  );
};

export default TableView;
