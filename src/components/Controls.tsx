import React from "react";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

interface ControlsProps {
  excludeSmallEOA: boolean;
  setExcludeSmallEOA: (v: boolean) => void;
  treatGnosisSafeAsEOA: boolean;
  setTreatGnosisSafeAsEOA: (v: boolean) => void;
}

const Controls: React.FC<ControlsProps> = ({
  excludeSmallEOA,
  setExcludeSmallEOA,
  treatGnosisSafeAsEOA,
  setTreatGnosisSafeAsEOA,
}) => (
  <div className="mt-4 flex flex-col space-y-4">
    <div className="flex items-center space-x-2">
      <Switch
        id="exclude-small-eoa"
        checked={excludeSmallEOA}
        onCheckedChange={setExcludeSmallEOA}
        className="border border-gray-500"
      />
      <Label htmlFor="exclude-small-eoa">Exclude small EOA balances</Label>
    </div>
    <div className="flex items-center space-x-2">
      <Switch
        id="treat-gnosis-safe-as-eoa"
        checked={treatGnosisSafeAsEOA}
        onCheckedChange={setTreatGnosisSafeAsEOA}
        className="border border-gray-500"
      />
      <Label htmlFor="treat-gnosis-safe-as-eoa">Treat Gnosis Safe as EOA</Label>
    </div>
  </div>
);

export default Controls;
