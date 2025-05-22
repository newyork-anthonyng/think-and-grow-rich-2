"use client";
import DesireWallContainer from "../DesireWall";
import Progress from "../Progress";
import CalendarInput from "../Progress/CalendarInput";
import { Progress as ProgressType } from "@/lib/types";
import { useMachine } from "@xstate/react";
import machine from "./machine";

function Dashboard() {
  const [state, send] = useMachine(machine);

  function handleProgressEntriesChange(progressEntries: ProgressType[]) {
    send({ type: "CHANGE_PROGRESS_ENTRIES", data: progressEntries });
  }

  return (
    <div>
      <DesireWallContainer />
      <div className="w-1/2">
        <Progress progressEntries={state.context.progressEntries} />
        <CalendarInput
          progressEntries={state.context.progressEntries}
          onProgressEntriesChange={handleProgressEntriesChange}
        />
      </div>
    </div>
  );
}

export default Dashboard;
