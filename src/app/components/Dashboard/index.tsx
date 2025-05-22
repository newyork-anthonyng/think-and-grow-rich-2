"use client";
import DesireWallContainer from "../DesireWall";
import Progress from "../Progress";
import CalendarInput from "../Progress/CalendarInput";
import { PendingProgress, Progress as ProgressType } from "@/lib/types";
import { useMachine } from "@xstate/react";
import machine from "./machine";
import { Button } from "@/components/ui/button";
function Dashboard() {
  const [state, send] = useMachine(machine);

  function handleProgressEntriesChange(
    progressEntries: (ProgressType | PendingProgress)[]
  ) {
    send({ type: "CHANGE_PROGRESS_ENTRIES", data: progressEntries });
  }

  function handleEditClick() {
    send({ type: "EDIT" });
  }

  function handleDoneClick() {
    send({ type: "DONE" });
  }

  return (
    <div>
      <div className="mb-8">
        <DesireWallContainer />
      </div>
      <div className="w-1/2">
        {state.matches("editing") ? (
          <div>
            <CalendarInput
              progressEntries={state.context.progressEntries}
              onProgressEntriesChange={handleProgressEntriesChange}
            />
            <Button onClick={handleDoneClick}>Done</Button>
          </div>
        ) : (
          <div>
            <Progress progressEntries={state.context.progressEntries} />
            <Button onClick={handleEditClick}>Add progress</Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
