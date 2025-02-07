import { Dialog, DialogContent } from "@shad/dialog";
import { AddAssociateForm } from "../forms/AddAssociateForm";
import { useHub } from "@taskboard/client/hooks/accounts/use-hub";






export const NewAssociateFormDialog = (props: { open: boolean; clear: () => void; }) => {
  const { account } = useHub.context()
  return (
    <Dialog open={props.open} onOpenChange={props.clear}>
      <DialogContent >
        <div className="max-h-">
          <AddAssociateForm account={account} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
