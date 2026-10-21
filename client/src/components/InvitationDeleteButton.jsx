import Button from "./Button";
import { Trash } from "lucide-react";

function InvitationDeleteButton({ id, deleteHandler }) {
  return (
    <Button
      variant="icon"
      className="ml-auto"
      onClick={() => {
        deleteHandler(id);
      }}
    >
      <Trash></Trash>
    </Button>
  );
}

export default InvitationDeleteButton;
