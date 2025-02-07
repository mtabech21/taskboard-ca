import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@shad/dialog";
import { Button } from "@shad/button";

export const NewAssociateAlert = (props: { badge_number: string | null; clear: () => void; showForm: (bn: string, fn: () => void) => void; }) => {
  const bn = props.badge_number;

  return (
    <Dialog open={props.badge_number != null} onOpenChange={props.clear}>
      <DialogContent className="flex justify-center align-middle">
        <DialogHeader>
          <DialogTitle className="text-lg p-3">Badge number <span className="font-extrabold p-3 bg-slate-200 rounded font-mono">{bn}</span> is not registered.</DialogTitle>
          <DialogDescription className="flex justify-between gap-3 align-middle">
            <Button onClick={props.clear} className="bg-red-600 w-full hover:bg-red-400">Back</Button>
            <Button onClick={() => { props.badge_number && props.showForm(props.badge_number, props.clear); }} className="bg-blue-600 w-full hover:bg-blue-400">New Associate</Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
